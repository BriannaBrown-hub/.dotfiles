## Change Log

* 3.22.6
    * Fix retrieving from package with only one type. This resolves `Retrieve from package.xml feature doesn't retrieve settings metadata` [#368](https://github.com/celador/ForceCode/issues/368)
* 3.22.5
    * Fix `Forcecode won't deploy file on save after a while` [#364](https://github.com/celador/ForceCode/issues/364)
* 3.22.4
    * Update dependencies
* 3.22.3
    * Fix `Record id is not found in record after timeout on class save to org occurred` [#361](https://github.com/celador/ForceCode/issues/361)
    * Update for API 48.0
    * Update dependencies
* 3.22.2
    * Add ability to change settings for static resources (Per resource) via using a `forceBundleSettings.json` file in the `resource-bundle` folder. This file will be auto-generated upon save of a static resource. If the resource exists in the org, the current settings of the resource will be used in the file.
    * Update Slack invite link [#357](https://github.com/celador/ForceCode/issues/357)
    * Fix issue saving binary static resource files (JPG, PNG, etc)
* 3.22.1
    * Transitioned delete functionality to SFDX. Now more types are supported for deleting from an org.
* 3.22.0
    * Add ignore functionality via the Forcecode `force.filesExclude` workspace setting. This can be used when deploying files to ignore files/folders. Forcecode now also respects `.forceignore` files in your workspace root as well. A `.forceignore` file will always supersede the `force.filesExclude` workspace setting. When choosing files to deploy, the ignore settings will be respected as well (Ignored files won't show in the list of files to choose from).
    * Add ability to remove source from org. Aura component pieces can be removed individually or as a whole. If you delete the Aura component's `cmp`, `app`, etc file or the `-meta.xml` file then the whole bundle will be removed from the org. When deleting an LWC, the whole bundle will ALWAYS be removed!
        * Currently, delete functionality is limited only to certain metadata (All metadata that can be created via the `New` menu option is supported and a few others). If you receive an error stating that the metadata wasn't found in the org and you are sure it is indeed there, then the type is not currently supported for deletion by Forcecode 
    * Fix "Cannot Deploy After Comparing" [#354](https://github.com/celador/ForceCode/issues/354)
* 3.21.4
    * Fix "Record id is not found in record" after create a new class [#349](https://github.com/celador/ForceCode/issues/349)
* 3.21.3
    * Fix issues switching usernames in the Saved Usernames view
    * Queue code coverage retrieval so it isn't called multiple times when refreshing modified files
* 3.21.2
    * Fix issue deploying static resources
    * Fix retrieval of static resource when working in the resource-bundles folder
    * Add option to reload the window after retrieving sObjects during a code completion refresh in order to reload the Apex extension
* 3.21.1
    * Fix `Deploy only working after a save command` [#345](https://github.com/celador/ForceCode/issues/345)
    * Fix `Save/Deploy/Compile Check for Diffs` [#334](https://github.com/celador/ForceCode/issues/334)
* 3.21.0
    * Add ability to save multiple files at a time, no need to wait for your apex class to finish before saving your trigger!
    * Add diff in context menu for aura and lwc
* 3.20.2
    * Fix issue with saving VisualForce pages and being shown a file change notification every time.
* 3.20.1
    * Turn on line decorations when a class in the Code Coverage view is clicked.
* 3.20.0
    * Add test coverage broken down by test class/method. Now you can see which test classes and methods are covering your class! Click on the dropdown next to a class name in the `Sufficient Coverage` or `Insufficient Coverage` section and you will be presented with a list of test classes and methods that cover your class. Clicking on one of these will open the tested class and update the coverage decorations to show you visually which lines are covered by each. This addresses the issue `Show test classes covering my class.` [#329](https://github.com/celador/ForceCode/issues/329). Thanks @Caio-Carvalho for the request for this!
* 3.19.2
    * Fix `LightningMessageChannel not supported` [#336](https://github.com/celador/ForceCode/issues/336). The `Production / Developer` option when logging into a new org has been split into separate options. For existing projects, if you want to try out the LightningMessageCenter Beta feature, you will need to open your Org Settings in the Forcecode menu and check the isDeveloperEdition checkbox then save in order to open Lightning Message Center files. Only developer editions (NOT SANDBOXES) currently support this feature! You will get an error message having this checked with a sandbox using API version 47.0!
* 3.19.1
    * Added Lightning Message Center metadata in `New` menu option as well as a type retrievable by the `Open` menu option
* 3.19.0
    * Updated default API version for Winter release (47.0)
    * Update vulnerabilities in dependencies
* 3.18.11
    * Reworded save timeout for apex. User must choose `Yes` now to continue polling for a status update.
    * Fix deploying custom fields
* 3.18.10
    * Fix folder metadata not being included in package.xml
    * Fix wrong tooling type detected by folder
* 3.18.9
    * Fix wrong slash being used in package xml files while trying to retrieve foldered metadata (Reports, Document, Dashboards, etc)
* 3.18.8
    * Fix `Orgs not properly switching in the Saved Usernames view` [#321](https://github.com/celador/ForceCode/issues/321)
* 3.18.7
    * Fix `New Lightning components not being deployed` [#319](https://github.com/celador/ForceCode/issues/319)
* 3.18.6
    * Fix `"Retrieve Package/Metadata" commands result in "Metadata describe error"` [#315](https://github.com/celador/ForceCode/issues/315) 
* 3.18.5
    * Fix project root not being assigned correctly, leading to the extension not functioning
* 3.18.4
    * Added support to select a definition file when creating a scratch org
    * Updated Forcecode view icon
    * Start-up performance improvements when loading an existing project
    * Fix missed `typeof` in fix for `Relationship fields not displayed` [#306](https://github.com/celador/ForceCode/issues/306)
* 3.18.3
    * Fix `Package not retrieved via Retrieve Package menu option` [#312](https://github.com/celador/ForceCode/issues/312)
    * Fix deploying certain metadata types.
* 3.18.2
    * Fix `Relationship fields not displayed` [#306](https://github.com/celador/ForceCode/issues/306)
    * Fix `e.split is not a function` [#307](https://github.com/celador/ForceCode/issues/307)
* 3.18.1
    * Fix not showing errors when metadata has a syntax error
    * Fix not refreshing an expired access token when saving a static resource
* 3.18.0
    * Performance improvements on startup
    * Execute anonymous output is now shown in a document like Apex test logs
    * Logging output is now shown in the Forcecode output panel
    * Show debug logs with dated names
    * Fix execute anonymous when project folder contains a space
    * Fix error related to ForceCode.treeDataProvider
    * Fix not catching some SFDX CLI errors
    * Fix Execute Anonymous functionality
    * Fix window not reloading when creating a project in a folder that's already open in VSCode
    * Fix various menus throwing errors when the user canceled or didn't make a selection
    * Add `bulkLoaderPollTimeout` setting in workspace settings to control the bulk load timeout. Default is 60000 (1 minute)
    * Add inline run test button to test classes listed in the Code Coverage view
    * Add inline cancel task button on cancellable running tasks
    * Add number of lines covered in Forcecode Code Coverage view hovers
    * Add time saved to end of SUCCESS! in save history view tooltip
    * Add option to cancel Apex save when it times out. This avoids receiving the container request error.
* 3.17.4
    * Fix issue with extension not loading
    * Fix issues retrieving debug logs
* 3.17.2
    * Fix being able to create a scratch org
    * Open Lightning when checking deployment status or opening file in org
    * Fix issue with receiving error about not being able to find the SFDX CLI when trying to view deployment error details
    * Fix issue with logging in when clicking on an org in the saved usernames list with a yellow circle
* 3.17.1
    * Fix users not receiving error message when SFDX wasn't installed on startup.
* 3.17.0
    * Allow retrieval of managed package reports/dashboards/etc.
    * Fix "Never prompts for diff/overwrite on save for Lightning Web Components" [#280](https://github.com/celador/ForceCode/issues/280)
    * Fix "3.16.0 not able to save LWC" [#277](https://github.com/celador/ForceCode/issues/277)
    * Fix "Forcecode hangs when there is a failed login attempt." [#275](https://github.com/celador/ForceCode/issues/275)
    * Remove salesforce-alm dependency. Users are now REQUIRED to install the SFDX-CLI
    * Because of salesforce-alm removal, the run DX command menu option has been removed.
    * Switched back to using webpack to pack the extension
    * Added ability to cancel running ForceCode Tasks! [#186](https://github.com/celador/ForceCode/issues/186)
    * Show error message with a link to download if the SFDX CLI isn't installed.
* 3.16.0
    * Fix issue [#264](https://github.com/celador/ForceCode/issues/264) (s.saveApex(...).then(...).then(...).catch(...).finally is not a function)
    * Fix deploy errors not being reported on first save after file creation
    * Fix "Always prompt for overwrite on save" issue [#267](https://github.com/celador/ForceCode/issues/267)
    * Fix "Setting org src as root causes `AuraDefinitionBundle metadata type not found in org`" issue [#265](https://github.com/celador/ForceCode/issues/265)
    * Fix diffing returning expired access/refresh token [#270](https://github.com/celador/ForceCode/issues/270)
    * Fix "Error while saving LWC with field definition imports" [#269](https://github.com/celador/ForceCode/issues/269)
    * Fix ignoreFocusOut when creating a new file
    * Fix error while trying to diff when the file doesn't exist on the server
* 3.15.2
    * Fix issue with first save of LWC or Aura components after creation. Users were being shown the file change notification.
    * Fix issue with hanging task after cancelling creating a file
    * Remove folder name prompt when creating a project. Users will now be able to just select a folder to create the project in
    * Add Save History view in the Forcecode view
    * Add maxSaveHistory in workspace settings to control the maximum number of save results to show in the Save History view
    * Fix not being able to activate the extension again after exiting out of the login menu (After creating a new project)
* 3.15.1
    * Fix issues deploying code after creation
    * Check for file changes on save now diffs the file contents instead of checking last modified dates. This makes the check more accurate
    * Fix issues with retrieve timeouts by adding the pollTimeout option back in
    * Fix issue with saving LWC metadata not working, but reporting success
    * Performance improvements
* 3.15.0
    * Add ForceCode: Create Project command to replace ForceCode: Show Menu. Now you won't need to have a folder open to create a project. Forcecode will do the heavy lifting for you! There is also a new Forcecode menu option (Right below the settings menu option) to allow for creating a new Forcecode project when Forcecode is active.
    * Added setDefaultUsernameOnLogin workspace setting. When checked, Forcecode will update the SFDX CLI default username to the current logged in org each time you switch usernames. This allows you to use Forcecode alongside of the Salesforce extensions, so you don't need to worry about changing the default username each time you switch orgs.
    * Add ability to have a separate sfdx-project.json for each org. Simply make changes to your sfdx-project.json and save the file, Forcecode will take care of the rest.
    * When the src setting is updated in the Org Settings menu option in the Forcecode menu, the sfdx-project.json "packageDirectories" property will be updated to match, allowing for better integration with the Salesforce extensions
    * Add alias option to org settings. When set, the alias is what will show in the saved usernames section of the Forcecode view instead of the username. This makes keeping track of orgs easier than remembering each username
    * Add force.onlyShowProjectUsernames workspace setting. If checked, Forcecode will only show the usernames in use in each project instead of every one that has been authenticated on your machine.
    * When selecting the Log In option in the Forcecode menu, all authenticated orgs on the machine will be shown in the list instead of just the project orgs. This makes it easier to set up a new project if you've previously authenticated an org
    * Add allowAnonymousUsageTracking to workspace settings for better persistance. You can now change your mind to send anonymous usage data at any time.
    * Fix creating extra files for LWC...e.g. a css file
* 3.14.1
    * Fix issue on Windows with refreshing from server [#244](https://github.com/celador/ForceCode/issues/244)
    * Add refresh and compile commands to the diff editor per issue [#242](https://github.com/celador/ForceCode/issues/242)
    * Fix expired access token not auto-refreshing on compile
* 3.14.0
    * Bump default API version to 45.0 for the spring 19 release
    * Add bulk loader menu option. Now you can user ForceCode to do bulk operations on files!
    * Migrate general (Non org-specific) settings to workspace settings
    * Add force.defaultApiVersion workspace setting. This allows you to configure what API version to default to when creating a new project or logging into a new org
    * Fix lingering issue with no notification shown on build error
    * Add ability to save/deploy email templates and documents
    * Fix deploying reports and dashboards
    * Fix issues with refreshing via the explorer context menu
    * Fix issue trying to update data in the query editor without selecting an Id
    * Fix ugly error messages from dxService
* 3.13.0
    * Add menu option to create scratch orgs
    * The Create Class menu option is now the New... option. You can now create Aura components, classes, LWC components, triggers, and Visualforce pages/components.
    * Fix an issue with failing deployments not showing the option to view details about the failed deployment
    * Rework first save of Aura components to deploy the entire component package to make life easier and avoid errors on save
    * Fix 'fullName of undefined' issue after retrieving files
    * Fix issue [#236](https://github.com/celador/ForceCode/issues/236) related to not showing build errors
    * Fix issue [#224](https://github.com/celador/ForceCode/issues/224) by retrieving managed package objects
* 3.12.0
    * Fix 'Retrieve Package not getting list of Unmanaged Packages' issue
    * Add --nopromt flag to fix issue [#205](https://github.com/celador/ForceCode/issues/205)
    * Fixes for issues related to retrieve
    * Add support for Lightning Web Components (API version 45.0 and higher)
    * Fixed not showing all errors on compile
* 3.11.3
    * Fix packageDirectories in sfdx-project.json (Thanks ReaperBeats!)
* 3.11.2
    * Add retrieve support for StandardValueSet per issue [#214](https://github.com/celador/ForceCode/issues/214)
    * Fix issues when retrieving metadata
    * Fix issue while retrieving lightning components
    * Show nice error message when deploying code outside of the src folder
* 3.11.1
    * Add ability to make inline edits to query results and save back to the server. Simply click the cell you want to edit, make the edit, then click Save Rows.
    * Fix issue with no files being retrieved when retrieving all metadata from an org
    * Fix 'Forcecode is reporting bad "Someone has changed this file!" for Aura files' [#209](https://github.com/celador/ForceCode/issues/209)
* 3.11.0
    * Add ability to retrieve foldered metadata (Reports, Dashboards, Email templates, and Documents) thanks @kenhuman!
        * You can currently only save reports and dashboards. Some email template metadata can be saved, but the templates themselves can't be saved.
    * Added a query editor to replace the simple SOQL/TOQL query menu options
    * Updated keyboard shortcuts for Execute Anonymous, Open, and deploying static resources for Windows and Linux, since there was conflicts with default VSCode shortcuts (Please see the README for the new shortcuts)
    * Change default of outputQueriesAsCSV to true
    * Add custom domain support
    * Don't include expired orgs in saved usernames list
* 3.10.3
    * Update Slack invite link
* 3.10.2
    * Development fixes for OS X by @mnunezdm
* 3.10.1
    * Fix access token bug where it wasn't being refreshed automatically
* 3.10.0
    * Show orgs that have a ForceCode configuration folder saved in the project in Saved Usernames
    * Add right-click to remove ForceCode configuration folder
    * Add ability to change settings for each org with a saved ForceCode configuration in settings
    * Add ability to remove ForceCode configuration folder in settings (Current logged in org can't be removed)
    * Hide singlePackage from setting. Forcecode doesn't support the folder structure required when setting this to false
    * Set checkForFileChanges to false by default for new projects
    * Fix more 'illegal value for line' issues
    * Catch deployment failed errors. ForceCode will ask if you would like to view the deployment status in the org.
    * Fix 'expired access/refresh token' error being shown instead of being asked to login again
    * Fix 'metadata of undefined' errors
    * Fix issue of ForceCode not executing any tasks once reaching the maxFileChangeNotifications limit
* 3.9.12
    * Fix login and logout issues
* 3.9.11
    * Emergency fix for startup bug where extension wouldn't start
* 3.9.10
    * Optimize the startup and login process
* 3.9.9
    * Add package builder menu option. Pick the types you want to be in your package then choose where to save
    * Added option to select types in retrieve menu option
    * Add analytics features that will help make tracking down errors a little easier
    * Retrieve standard objects when retrieving all metadata
    * Fix connection issue where users were getting 'cannot read tooling/metadata of undefined' error
    * Fix 'illegal value for line' issue when trying to save scheduled class
    * Fix errors related to lighting components (Creating new ones and errors with 'getWSMember of undefined')
    * Fix some login related issues
    * Fix extension loading issue when moving the project directory
* 3.9.7
    * Add staticResourceCacheControl setting. Now you can select if the cacheControl is public or private.
    * Fix issue with settings not loading correctly
    * Fix "illegal value for line" when saving apex classes or pages with specific errors.
    * Fix not asking for autoCompile when it's undefined. This solves saving issues.
* 3.9.6
    * Fix settings menu option throwing an error
    * Fix right-click to log out of an org
    * Fix "Cannot read property 'getWsMember' of undefined" for lightning apps and events
    * Fix ForceCode opening more than showFilesOnOpenMax
    * Fix connecting to a scratch org
    * Implement saving lighting tokens and interfaces
    * Added settings-per-org feature
    * Added option to view details of failed deployment
* 3.9.5
    * Fix compatibility issues related to login with sfdx cli
* 3.9.4
    * Fix issue with nothing showing up in the code coverage view
* 3.9.3
    * Fixed some login issues
    * Fixed invisible tasks showing up sometimes
    * Fix issue with problem reporting on Visualforce and Apex (Thanks to mnunezdm)
* 3.9.2
    * Fixed Switching Orgs and saving files results in "Insufficient access rights on cross-reference id" 
    * Fixed retrieve still hanging as a task
* 3.9.1
    * Added outputQueriesAsCSV option to allow retrieving query results as csv files instead of JSON
    * Finally fixed the hanging retrieve bug (Would hang on open, refresh, retrieve by package.xml, etc)
    * Remove manual package retrieval. If it doesn't show in the menu then it doesn't exist and retrieving by name will fail every time
* 3.9.0
    * New menu option in Deploy to choose files in your current org folder to deploy. ForceCode will build a package.xml file and deploy the files!
    * Fixed package.xml task hanging. If it gives you a deploy error, you're most likely missing at least one -meta.xml file!
    * ForceCode now retrieves code coverage (For the code coverage view) when you get the overall coverage.
    * Fixed an issue with files being shown as 'Not in current org' when there has been changed files and the user dismissed the message(s).
    * Fixed an issue with output panel stuff being shown in the 'Open Files Not In Src' section.
