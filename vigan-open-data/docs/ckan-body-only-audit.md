# CKAN Body-Only Embed Audit

## Route Ownership Matrix

| Route family | Owner | Navigation mode | Chrome rule |
| --- | --- | --- | --- |
| `/` | Next shell | Top-level Next navigation | Next header/footer only |
| `/datasets` | Next shell | Top-level Next navigation | Next header/footer only |
| `/datasets/[id]` | Next shell | Top-level Next navigation | Next header/footer only |
| `/datasets/[id]/resources/[rid]` | Next shell | Top-level Next navigation | Next header/footer only |
| `/organizations` | Next shell | Top-level Next navigation | Next header/footer only |
| `/organizations/[id]` | Next shell | Top-level Next navigation | Next header/footer only |
| `/groups` | Next shell | Top-level Next navigation | Next header/footer only |
| `/groups/[id]` | Next shell | Top-level Next navigation | Next header/footer only |
| `/about` | Next shell | Top-level Next navigation | Next header/footer only |
| `/api-docs` | Next shell | Top-level Next navigation | Next header/footer only |
| Footer-linked pages | Next shell | Top-level Next navigation | Next header/footer only |
| `/api/ckan-proxy/**` | Embedded CKAN body | Iframe-only CKAN navigation | CKAN header/footer stripped and hidden |
| Direct legacy CKAN public routes `/dataset/**`, `/organization/**`, `/group/**`, `/dataset/groups/**` | Redirected to Next shell | Top-level redirect promotion | Next header/footer only |

## Audit Findings

| Route | Reproduction | Observed result | Expected result | Owning layer | Fix direction |
| --- | --- | --- | --- | --- | --- |
| `/datasets` | Open catalog and search/filter | CKAN iframe owned the public page and could expose CKAN chrome during refresh | Next shell owns catalog | Wrong route ownership | Replaced with native Next catalog using CKAN API |
| `/datasets/[id]` | Open a dataset from catalog | Dataset detail stayed inside CKAN iframe and depended on proxy stripping | Next shell owns dataset detail | Wrong route ownership | Replaced with native Next dataset detail |
| `/dataset/:id/resource/:rid` | Use resource preview actions | CKAN preview route could create nested shells or show CKAN page furniture | Next shell owns preview route | Nested preview/proxy bypass | Added `/datasets/[id]/resources/[rid]` and rewired links |
| `/organization/:id` | Click organization links from public pages | Link promotion collapsed to `/organizations` index instead of detail | Organization detail route under Next shell | Wrong navigation promotion | Added `/organizations/[id]` and redirect rewrite |
| `/group` and `/dataset/groups/:id` | Follow group links/tabs from dataset pages | No shell-owned public route existed | Group routes stay in Next shell | Wrong route ownership | Added `/groups` and `/groups/[id]`, plus nginx redirects |
| `/api/ckan-proxy/**` | Refresh embedded CKAN body paths | Proxy stripping only covered a narrow set of CKAN chrome variants | Body-only embedded HTML | Incomplete CKAN chrome suppression | Expanded strip rules and hide selectors |

## Remediation Backlog

### Completed

- Routing ownership fixes
  - Affected routes: `/datasets`, `/datasets/[id]`, `/datasets/[id]/resources/[rid]`, `/organizations`, `/organizations/[id]`, `/groups`, `/groups/[id]`
  - Layer: Next app routes
  - Acceptance: Public pages render directly in Next without CKAN shell markup
  - CKAN header/footer absent after fix: Yes

- CKAN chrome suppression fixes
  - Affected routes: `/api/ckan-proxy/**`
  - Layer: Next proxy route
  - Acceptance: Residual embedded CKAN HTML has header/footer, legal, language, and masthead variants stripped or hidden
  - CKAN header/footer absent after fix: Yes for embedded proxy responses

- Navigation promotion fixes
  - Affected routes: legacy `/dataset/**`, `/organization/**`, `/group/**`, `/dataset/groups/**`
  - Layer: `CKANFrame.tsx` and nginx
  - Acceptance: Public clicks and direct legacy hits land on shell-owned Next pages
  - CKAN header/footer absent after fix: Yes

### Remaining follow-up

- Nested preview/proxy fixes
  - Affected routes: any future CKAN preview plugins that emit deeper CKAN HTML/iframes
  - Layer: proxy rewrite coverage
  - Acceptance: New preview plugins must either map into Next-owned preview routes or stay under `/api/ckan-proxy/**`
  - CKAN header/footer absent after fix: Required

- Dead/conflicting route logic removal
  - Affected routes: unused public CKAN iframe entry points
  - Layer: frontend cleanup
  - Acceptance: remove obsolete public iframe usage once no public pages depend on it
  - CKAN header/footer absent after fix: Required
