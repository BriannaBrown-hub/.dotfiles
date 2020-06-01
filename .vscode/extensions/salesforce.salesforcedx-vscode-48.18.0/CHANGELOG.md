# 48.18.0 - May 28, 2020

## Fixed

#### salesforcedx-vscode-lwc

- Fix LWC preview on Windows when running `SFDX: Preview Component Locally` ([PR #2212](https://github.com/forcedotcom/salesforcedx-vscode/pull/2212), [Issue #1903](https://github.com/forcedotcom/salesforcedx-vscode/issues/1903))

#### salesforcedx-utils-vscode

- Correctly surface errors for failed CLI commands ([PR #2216](https://github.com/forcedotcom/salesforcedx-vscode/pull/2216), [Issue #2160](https://github.com/forcedotcom/salesforcedx-vscode/issues/2160), [Issue #2005](https://github.com/forcedotcom/salesforcedx-vscode/issues/2005))

# 48.16.0 - May 20, 2020

## Fixed

#### salesforcedx-vscode-lwc

- Fix LWC tests failing when default shell is set to Git Bash ([PR #2103](https://github.com/forcedotcom/salesforcedx-vscode/pull/2103), [Issue #2097](https://github.com/forcedotcom/salesforcedx-vscode/issues/2097))

## Added

#### salesforcedx-vscode-code

- Disabling telemetry in the extensions also disables telemetry collected in the CLI, and vice versa ([PR #2193](https://github.com/forcedotcom/salesforcedx-vscode/pull/2193))

# 48.15.0 - May 14, 2020

- We fixed some minor under-the-hood bugs.

# 48.14.0 - May 7, 2020

## Fixed

#### salesforcedx-vscode-lightning, salesforcedx-vscode-lwc

- Removed Beta Lightning Explorer Feature ([PR #2148](https://github.com/forcedotcom/salesforcedx-vscode/pull/2148))

#### docs

- Removed documentation for Beta Lightning Explorer Feature ([PR #2148](https://github.com/forcedotcom/salesforcedx-vscode/pull/2148))

## Added

# 48.13.0 - April 30, 2020

## Fixed

#### salesforcedx-vscode-core

- Fix displaying a success message when a Beta Deploy contains failures ([PR #2143](https://github.com/forcedotcom/salesforcedx-vscode/pull/2143), [Issue #2124](https://github.com/forcedotcom/salesforcedx-vscode/issues/2124))

## Added

#### salesforcedx-vscode-core

- Beta for source retrieve on Apex, Visualforce, Aura and LWC [Performance Enhancements](https://developer.salesforce.com/tools/vscode/en/user-guide/perf-enhancements) ([PR #2102](https://github.com/forcedotcom/salesforcedx-vscode/pull/2102))

- Add diagnostics for beta deploys ([PR #2143](https://github.com/forcedotcom/salesforcedx-vscode/pull/2143))

# 48.11.0 - April 16, 2020

## Fixed

#### docs

- Fix broken Java Setup link in [Apex Tests](https://forcedotcom.github.io/salesforcedx-vscode/articles/apex/testing) ([PR #2119](https://github.com/forcedotcom/salesforcedx-vscode/pull/2119), [Issue #2108](https://github.com/forcedotcom/salesforcedx-vscode/issues/2108))

## Added

#### salesforcedx-vscode-core

- Added a message to display info when selecting scratch org definition and an error message when no scratch org definition files exist. ([PR #2115](https://github.com/forcedotcom/salesforcedx-vscode/pull/2115))

# 48.10.0 - April 9, 2020

## Added

#### salesforcedx-vscode-core

- Added tree visualization to [conflict detection beta](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/detect-conflicts) ([PR #2096](https://github.com/forcedotcom/salesforcedx-vscode/pull/2096))

- Added support for Apex Triggers, Visualforce Pages, and Visualforce Components to [performance enhancements beta](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/perf-enhancements)([PR #2111](https://github.com/forcedotcom/salesforcedx-vscode/pull/2111))

# 48.9.0 - April 2, 2020

## Fixed

#### docs

- Fixed documentation for [Prettier Setup Requirements](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/prettier) ([PR #2105](https://github.com/forcedotcom/salesforcedx-vscode/pull/2105), [Issue #2079](https://github.com/forcedotcom/salesforcedx-vscode/issues/2079))

## Added

#### docs

- Added documentation for [Highlighting Apex Code Coverage](https://forcedotcom.github.io/salesforcedx-vscode/articles/apex/testing) ([PR #2104](https://github.com/forcedotcom/salesforcedx-vscode/pull/2104))

# 48.8.0 - March 26, 2020

## Fixed

#### salesforcedx-vscode-apex

- Hide commands in Apex Test sidebar from appearing in the Command Palette ([PR #2093](https://github.com/forcedotcom/salesforcedx-vscode/pull/2093))

# 48.7.0 - March 20, 2020

## Fixed

#### docs

- Add linting topic to LWC parent ([PR #2060](https://github.com/forcedotcom/salesforcedx-vscode/pull/2060))

# 48.6.0 - March 12, 2020

## Fixed

#### docs

- Update Apex content ([PR #1967](https://github.com/forcedotcom/salesforcedx-vscode/pull/1967))

#### salesforcedx-vscode-lightning, salesforcedx-vscode-lwc

- Prevent extensions activating in non-Salesforce projects ([PR #2070](https://github.com/forcedotcom/salesforcedx-vscode/pull/2070), [Issue #1988](https://github.com/forcedotcom/salesforcedx-vscode/issues/1988), [Issue #2065](https://github.com/forcedotcom/salesforcedx-vscode/issues/2065))

## Added

#### salesforcedx-vscode-core

- Open beta for performance enhancements on single Apex Class deploys. Refer to the [Performance Enhancements](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/perf-enhancements) article. ([PR #2052](https://github.com/forcedotcom/salesforcedx-vscode/pull/2052))

# 48.5.0 - March 5, 2020

## Fixed

#### salesforcedx-vscode-apex

- Remove error from the Apex LSP for completion results of `Page.` ([PR #2054](https://github.com/forcedotcom/salesforcedx-vscode/pull/2054))

## Added

#### docs

- Update contributor info for Prettier Apex plugin [Prettier Apex plugin](https://github.com/dangmai/prettier-plugin-apex) ([PR #2035](https://github.com/forcedotcom/salesforcedx-vscode/pull/2035))-Contribution by [Dang Mai](https://github.com/dangmai)

# 48.4.0 - February 27, 2020

- We did some minor under-the-hood maintenance.

# 48.3.0 - February 24, 2020

## Fixed

#### docs

- Updates to Conflict Detection documentation ([PR #2021](https://github.com/forcedotcom/salesforcedx-vscode/pull/2021))

#### salesforcedx-vscode-core

- Fix ISV Debugger failing with `'Cannot set property 'SFDX_TOOL' of undefined'` ([PR #2027](https://github.com/forcedotcom/salesforcedx-vscode/pull/2027), [Issue #2013](https://github.com/forcedotcom/salesforcedx-vscode/issues/2013))

# 48.2.0 - February 20, 2020

## Fixed

#### salesforcedx-vscode-lightning, salesforcedx-vscode-lwc

- Remove automatic configuration of `eslint.nodePath` and `eslintrc.json` ([PR #1771](https://github.com/forcedotcom/salesforcedx-vscode/pull/1771)), ([Issue #1644](https://github.com/forcedotcom/salesforcedx-vscode/issues/1644)), ([Issue #1394](https://github.com/forcedotcom/salesforcedx-vscode/issues/1394)), ([Issue #1049](https://github.com/forcedotcom/salesforcedx-vscode/issues/1049))

#### docs

- Update [Org Browser](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/org-browser) article ([PR #1971](https://github.com/forcedotcom/salesforcedx-vscode/pull/1971))
- Update supported metadata list for [Source Diff](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/source-diff) ([PR #1969](https://github.com/forcedotcom/salesforcedx-vscode/pull/1969))

## Added

#### salesforcedx-vscode-core

- Open beta for conflict detection in manifest operations ([PR #1921](https://github.com/forcedotcom/salesforcedx-vscode/pull/1921)). Refer to [Conflict Detection](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/detect-conflicts) article ([PR #2001](https://github.com/forcedotcom/salesforcedx-vscode/pull/2001))

# 48.1.0 - February 15, 2020

## Fixed

#### docs

- Fix broken links in Lightning and LWC articles ([PR #1987](https://github.com/forcedotcom/salesforcedx-vscode/pull/1987), [PR #1984](https://github.com/forcedotcom/salesforcedx-vscode/pull/1984), [PR #1917](https://github.com/forcedotcom/salesforcedx-vscode/pull/1917))

#### salesforcedx-vscode-apex

- Syntax highlighting for SOQL query clauses ([PR #1973](https://github.com/forcedotcom/salesforcedx-vscode/pull/1973), [Issue #1180](https://github.com/forcedotcom/salesforcedx-vscode/issues/1180))
- Syntax highlighting for multiple string when clauses on Apex switch statements ([PR #1973](https://github.com/forcedotcom/salesforcedx-vscode/pull/1973), [Issue #967](https://github.com/forcedotcom/salesforcedx-vscode/issues/967))
- Restrict completion options to only direct members of a Type or Namespace ([PR #1966](https://github.com/forcedotcom/salesforcedx-vscode/pull/1966))
  ![GIF showing Apex code completion options](https://raw.githubusercontent.com/forcedotcom/salesforcedx-vscode/develop/packages/salesforcedx-vscode/images/48.1.0/completion-dot-notation.gif)

#### salesforcedx-vscode-core

- Fix scratch org create command not allowing empty string during input ([PR #1953](https://github.com/forcedotcom/salesforcedx-vscode/pull/1953), [Issue #1929](https://github.com/forcedotcom/salesforcedx-vscode/issues/1929))-Contribution by [@FabienTaillon](https://github.com/FabienTaillon)

## Added

#### salesforcedx-vscode-apex

- Syntax highlighting support for JavaDoc ([PR #1973](https://github.com/forcedotcom/salesforcedx-vscode/pull/1973))-Contribution by [@Codeneos](https://github.com/Codeneos)
- Syntax highlighting support for `inherited sharing` and `transient` Apex keywords ([PR #1973](https://github.com/forcedotcom/salesforcedx-vscode/pull/1973))-Contribution by [@Codeneos](https://github.com/Codeneos)
- Documentation for System class in autocomplete & hover ([PR #1966](https://github.com/forcedotcom/salesforcedx-vscode/pull/1966))
  ![GIF showing Apex code completion with documentation](https://raw.githubusercontent.com/forcedotcom/salesforcedx-vscode/develop/packages/salesforcedx-vscode/images/48.1.0/system-class-docs.gif)