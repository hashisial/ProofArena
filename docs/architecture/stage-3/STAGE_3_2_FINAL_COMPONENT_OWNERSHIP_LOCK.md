# Stage 3.2 Final Component Ownership Lock

| ID | Category/owner | Allowed/forbidden location | Shared promotion/stay rule | Imports/tokens/API/auth rule | Risk/validation | Stop |
|---|---|---|---|---|---|---|
| FC-01 | Module-specific/module | Approved module path later; never shared/platform by default | Stay module-owned while domain semantics exist | Public module/platform APIs; platform tokens; no raw API/auth/session | High; render/a11y/dependency tests | Owner/path unclear |
| FC-02 | Shared UI/shared | `components/ui` or approved common; never module-specific logic | 2+ consumers, stable product-agnostic abstraction | No module/API/auth imports; platform tokens | High; consumer/a11y/visual tests | Product assumptions present |
| FC-03 | Layout/platform | `client/src/layouts`; never modules/shared UI | Never module-owned | Platform route/auth APIs and tokens only | Critical; route/nesting/responsive tests | Module layout proposed |
| FC-04 | Dashboard shell/platform | Existing dashboard shell; never domain module | Domain cards stay module-owned; shell does not move | Public module hooks only; no private services | Critical; role/state/responsive tests | Second shell/policy source |
| FC-05 | Navigation/sidebar/platform | Existing navigation/sidebar; never module | Never module-owned | Route constants and platform auth only | Critical; link/role/mobile tests | Duplicate nav/sidebar |
| FC-06 | Public marketing/public | Home/public pages; never generic module/shared unless primitive | Marketing composition remains public-owned | Public-safe data, public layout/tokens | Medium; privacy/responsive tests | Private/module policy enters |
| FC-07 | Forms/module | Owning module after approval; primitives shared | Domain schema keeps form private | Calls module hooks; no direct API/auth | Medium; validation/submit/error tests | Business/transport logic embedded |
| FC-08 | Data display/module | Module for domain cards/tables; neutral primitive shared | Promote only neutral display primitive | Props/public contracts; no raw API | Medium; state/format/a11y tests | Domain behavior hidden as generic |
| FC-09 | Empty/loading/error/shared plus module | Generic primitives shared; domain action/copy module | Split primitive from domain composition | Platform errors/tokens; no invented production state | High; honest state/error tests | Fake data/behavior |
| FC-10 | Admin/admin under platform | Admin module UI; shell/nav shared platform | Generic primitive only may promote | Admin hooks/public contracts; backend auth authoritative | Critical; negative-access/audit tests | Role/shell/business ownership leak |
| FC-11 | Auth/payment sensitive/module under platform | Domain UI only; never shared by convenience | No promotion while sensitive semantics exist | No token/secret/provider/client logic | Critical; security/payment tests | Sensitive state or client logic in UI |

Components never instantiate clients, own routing/auth/session, or implement backend business rules.

