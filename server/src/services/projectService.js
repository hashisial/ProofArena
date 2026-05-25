import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { notifyProjectUpdate } from "./notificationService.js";

const projectStatuses = new Set(["open", "in_progress", "completed", "cancelled"]);

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("Project deadline must be a valid date", 400);
  }

  return date;
}

function normalizeProjectData(projectData = {}, { partial = false } = {}) {
  const normalizedProject = {};

  ["description", "title"].forEach((field) => {
    if (projectData[field] !== undefined) {
      normalizedProject[field] = String(projectData[field] ?? "").trim();
    }
  });

  if (projectData.budget !== undefined) {
    const budget = Number(projectData.budget);

    if (!Number.isFinite(budget) || budget < 0) {
      throw new AppError("Project budget must be a positive number", 400);
    }

    normalizedProject.budget = budget;
  }

  if (projectData.deadline !== undefined) {
    normalizedProject.deadline = normalizeDate(projectData.deadline);
  }

  if (projectData.providerId !== undefined) {
    const providerId = String(projectData.providerId ?? "").trim();

    if (providerId && !mongoose.isValidObjectId(providerId)) {
      throw new AppError("Provider ID is invalid", 400);
    }

    normalizedProject.providerId = providerId || null;
  }

  if (projectData.status !== undefined) {
    normalizedProject.status = String(projectData.status ?? "").trim().toLowerCase();
  }

  if (!partial || normalizedProject.title !== undefined) {
    if (!normalizedProject.title) {
      throw new AppError("Project title is required", 400);
    }
  }

  if (!partial || normalizedProject.description !== undefined) {
    if (!normalizedProject.description) {
      throw new AppError("Project description is required", 400);
    }
  }

  if (!partial) {
    normalizedProject.budget = normalizedProject.budget ?? 0;
    normalizedProject.status = normalizedProject.status || "open";
  }

  if (normalizedProject.status && !projectStatuses.has(normalizedProject.status)) {
    throw new AppError("Project status is invalid", 400);
  }

  return normalizedProject;
}

function getProjectScope(userId) {
  return {
    $or: [{ clientId: userId }, { providerId: userId }],
  };
}

function getProjectProjection() {
  return "budget clientId createdAt deadline description providerId status title updatedAt";
}

function normalizeProject(project) {
  if (!project) {
    return project;
  }

  return {
    ...project,
    client: project.clientId,
    provider: project.providerId,
  };
}

export async function findProjectsForUser(userId, { status } = {}) {
  ensureDatabaseConnection();

  const query = {
    ...getProjectScope(userId),
  };

  if (status && projectStatuses.has(status)) {
    query.status = status;
  }

  const projects = await Project.find(query)
    .sort({ updatedAt: -1, createdAt: -1 })
    .select(getProjectProjection())
    .populate("clientId", "email fullName name username")
    .populate("providerId", "email fullName name username")
    .lean();

  return projects.map(normalizeProject);
}

export async function createProjectForUser(userId, projectData) {
  ensureDatabaseConnection();

  const project = await Project.create({
    ...normalizeProjectData(projectData),
    clientId: userId,
  });

  await notifyProjectUpdate({
    message: `Project created: ${project.title}`,
    projectId: project._id,
    recipientIds: [userId],
    status: project.status,
  });

  return project.toObject();
}

export async function updateProjectForUser(userId, projectId, projectData) {
  ensureDatabaseConnection();

  if (!mongoose.isValidObjectId(projectId)) {
    throw new AppError("Project ID is invalid", 400);
  }

  const update = normalizeProjectData(projectData, { partial: true });

  if (Object.keys(update).length === 0) {
    throw new AppError("No project fields provided for update", 400);
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
      ...getProjectScope(userId),
    },
    update,
    {
      new: true,
      runValidators: true,
    },
  )
    .select(getProjectProjection())
    .populate("clientId", "email fullName name username")
    .populate("providerId", "email fullName name username")
    .lean();

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (update.status) {
    await notifyProjectUpdate({
      message: `Project status updated to ${update.status.replace(/_/g, " ")}.`,
      projectId,
      recipientIds: [userId],
      status: update.status,
    });
  }

  return normalizeProject(project);
}
