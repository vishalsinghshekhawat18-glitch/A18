<!DOCTYPE html>

<html  dir="ltr" lang="en" xml:lang="en">
<head>
    <title></title>
    <link rel="shortcut icon" href="//iibflms.digivarsity.com/pluginfile.php/1/theme_remui/faviconurl/1786693154/logo.jfif" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="moodle, " />
<link rel="stylesheet" type="text/css" href="https://iibflms.digivarsity.com/theme/yui_combo.php?rollup/3.17.2/yui-moodlesimple-min.css" /><script id="firstthemesheet" type="text/css">/** Required in order to fix style inclusion problems in IE with YUI **/</script><link rel="stylesheet" type="text/css" href="https://iibflms.digivarsity.com/theme/styles.php/remui/1786693154_1/all" />
<script type="text/javascript">
//<![CDATA[
var M = {}; M.yui = {};
M.pageloadstarttime = new Date();
M.cfg = {"wwwroot":"https:\/\/iibflms.digivarsity.com","sesskey":"zXAEo05HRy","sessiontimeout":"7200","themerev":"1786693154","slasharguments":1,"theme":"remui","iconsystemmodule":"core\/icon_system_fontawesome","jsrev":"1786041251","admin":"admin","svgicons":true,"usertimezone":"Asia\/Kolkata","contextid":20151,"langrev":1786041251,"templaterev":"1786041251"};var yui1ConfigFn = function(me) {if(/-skin|reset|fonts|grids|base/.test(me.name)){me.type='css';me.path=me.path.replace(/\.js/,'.css');me.path=me.path.replace(/\/yui2-skin/,'/assets/skins/sam/yui2-skin')}};
var yui2ConfigFn = function(me) {var parts=me.name.replace(/^moodle-/,'').split('-'),component=parts.shift(),module=parts[0],min='-min';if(/-(skin|core)$/.test(me.name)){parts.pop();me.type='css';min=''}
if(module){var filename=parts.join('-');me.path=component+'/'+module+'/'+filename+min+'.'+me.type}else{me.path=component+'/'+component+'.'+me.type}};
YUI_config = {"debug":false,"base":"https:\/\/iibflms.digivarsity.com\/lib\/yuilib\/3.17.2\/","comboBase":"https:\/\/iibflms.digivarsity.com\/theme\/yui_combo.php?","combine":true,"filter":null,"insertBefore":"firstthemesheet","groups":{"yui2":{"base":"https:\/\/iibflms.digivarsity.com\/lib\/yuilib\/2in3\/2.9.0\/build\/","comboBase":"https:\/\/iibflms.digivarsity.com\/theme\/yui_combo.php?","combine":true,"ext":false,"root":"2in3\/2.9.0\/build\/","patterns":{"yui2-":{"group":"yui2","configFn":yui1ConfigFn}}},"moodle":{"name":"moodle","base":"https:\/\/iibflms.digivarsity.com\/theme\/yui_combo.php?m\/1786041251\/","combine":true,"comboBase":"https:\/\/iibflms.digivarsity.com\/theme\/yui_combo.php?","ext":false,"root":"m\/1786041251\/","patterns":{"moodle-":{"group":"moodle","configFn":yui2ConfigFn}},"filter":null,"modules":{"moodle-core-tooltip":{"requires":["base","node","io-base","moodle-core-notification-dialogue","json-parse","widget-position","widget-position-align","event-outside","cache-base"]},"moodle-core-chooserdialogue":{"requires":["base","panel","moodle-core-notification"]},"moodle-core-popuphelp":{"requires":["moodle-core-tooltip"]},"moodle-core-formchangechecker":{"requires":["base","event-focus","moodle-core-event"]},"moodle-core-lockscroll":{"requires":["plugin","base-build"]},"moodle-core-maintenancemodetimer":{"requires":["base","node"]},"moodle-core-languninstallconfirm":{"requires":["base","node","moodle-core-notification-confirm","moodle-core-notification-alert"]},"moodle-core-actionmenu":{"requires":["base","event","node-event-simulate"]},"moodle-core-blocks":{"requires":["base","node","io","dom","dd","dd-scroll","moodle-core-dragdrop","moodle-core-notification"]},"moodle-core-handlebars":{"condition":{"trigger":"handlebars","when":"after"}},"moodle-core-event":{"requires":["event-custom"]},"moodle-core-dragdrop":{"requires":["base","node","io","dom","dd","event-key","event-focus","moodle-core-notification"]},"moodle-core-notification":{"requires":["moodle-core-notification-dialogue","moodle-core-notification-alert","moodle-core-notification-confirm","moodle-core-notification-exception","moodle-core-notification-ajaxexception"]},"moodle-core-notification-dialogue":{"requires":["base","node","panel","escape","event-key","dd-plugin","moodle-core-widget-focusafterclose","moodle-core-lockscroll"]},"moodle-core-notification-alert":{"requires":["moodle-core-notification-dialogue"]},"moodle-core-notification-confirm":{"requires":["moodle-core-notification-dialogue"]},"moodle-core-notification-exception":{"requires":["moodle-core-notification-dialogue"]},"moodle-core-notification-ajaxexception":{"requires":["moodle-core-notification-dialogue"]},"moodle-core_availability-form":{"requires":["base","node","event","event-delegate","panel","moodle-core-notification-dialogue","json"]},"moodle-backup-backupselectall":{"requires":["node","event","node-event-simulate","anim"]},"moodle-backup-confirmcancel":{"requires":["node","node-event-simulate","moodle-core-notification-confirm"]},"moodle-course-management":{"requires":["base","node","io-base","moodle-core-notification-exception","json-parse","dd-constrain","dd-proxy","dd-drop","dd-delegate","node-event-delegate"]},"moodle-course-util":{"requires":["node"],"use":["moodle-course-util-base"],"submodules":{"moodle-course-util-base":{},"moodle-course-util-section":{"requires":["node","moodle-course-util-base"]},"moodle-course-util-cm":{"requires":["node","moodle-course-util-base"]}}},"moodle-course-categoryexpander":{"requires":["node","event-key"]},"moodle-course-modchooser":{"requires":["moodle-core-chooserdialogue","moodle-course-coursebase"]},"moodle-course-formatchooser":{"requires":["base","node","node-event-simulate"]},"moodle-course-dragdrop":{"requires":["base","node","io","dom","dd","dd-scroll","moodle-core-dragdrop","moodle-core-notification","moodle-course-coursebase","moodle-course-util"]},"moodle-form-shortforms":{"requires":["node","base","selector-css3","moodle-core-event"]},"moodle-form-dateselector":{"requires":["base","node","overlay","calendar"]},"moodle-form-passwordunmask":{"requires":[]},"moodle-question-preview":{"requires":["base","dom","event-delegate","event-key","core_question_engine"]},"moodle-question-searchform":{"requires":["base","node"]},"moodle-question-chooser":{"requires":["moodle-core-chooserdialogue"]},"moodle-availability_completion-form":{"requires":["base","node","event","moodle-core_availability-form"]},"moodle-availability_date-form":{"requires":["base","node","event","io","moodle-core_availability-form"]},"moodle-availability_grade-form":{"requires":["base","node","event","moodle-core_availability-form"]},"moodle-availability_group-form":{"requires":["base","node","event","moodle-core_availability-form"]},"moodle-availability_grouping-form":{"requires":["base","node","event","moodle-core_availability-form"]},"moodle-availability_profile-form":{"requires":["base","node","event","moodle-core_availability-form"]},"moodle-mod_assign-history":{"requires":["node","transition"]},"moodle-mod_attendance-groupfilter":{"requires":["base","node"]},"moodle-mod_customcert-rearrange":{"requires":["dd-delegate","dd-drag"]},"moodle-mod_quiz-questionchooser":{"requires":["moodle-core-chooserdialogue","moodle-mod_quiz-util","querystring-parse"]},"moodle-mod_quiz-util":{"requires":["node","moodle-core-actionmenu"],"use":["moodle-mod_quiz-util-base"],"submodules":{"moodle-mod_quiz-util-base":{},"moodle-mod_quiz-util-slot":{"requires":["node","moodle-mod_quiz-util-base"]},"moodle-mod_quiz-util-page":{"requires":["node","moodle-mod_quiz-util-base"]}}},"moodle-mod_quiz-modform":{"requires":["base","node","event"]},"moodle-mod_quiz-toolboxes":{"requires":["base","node","event","event-key","io","moodle-mod_quiz-quizbase","moodle-mod_quiz-util-slot","moodle-core-notification-ajaxexception"]},"moodle-mod_quiz-autosave":{"requires":["base","node","event","event-valuechange","node-event-delegate","io-form"]},"moodle-mod_quiz-quizbase":{"requires":["base","node"]},"moodle-mod_quiz-dragdrop":{"requires":["base","node","io","dom","dd","dd-scroll","moodle-core-dragdrop","moodle-core-notification","moodle-mod_quiz-quizbase","moodle-mod_quiz-util-base","moodle-mod_quiz-util-page","moodle-mod_quiz-util-slot","moodle-course-util"]},"moodle-message_airnotifier-toolboxes":{"requires":["base","node","io"]},"moodle-block_xp-filters":{"requires":["base","node","moodle-core-dragdrop","moodle-block_xp-rulepicker"]},"moodle-block_xp-rulepicker":{"requires":["base","node","handlebars","moodle-core-notification-dialogue"]},"moodle-block_xp-notification":{"requires":["base","node","handlebars","button-plugin","moodle-core-notification-dialogue"]},"moodle-filter_glossary-autolinker":{"requires":["base","node","io-base","json-parse","event-delegate","overlay","moodle-core-event","moodle-core-notification-alert","moodle-core-notification-exception","moodle-core-notification-ajaxexception"]},"moodle-filter_mathjaxloader-loader":{"requires":["moodle-core-event"]},"moodle-editor_atto-rangy":{"requires":[]},"moodle-editor_atto-editor":{"requires":["node","transition","io","overlay","escape","event","event-simulate","event-custom","node-event-html5","node-event-simulate","yui-throttle","moodle-core-notification-dialogue","moodle-core-notification-confirm","moodle-editor_atto-rangy","handlebars","timers","querystring-stringify"]},"moodle-editor_atto-plugin":{"requires":["node","base","escape","event","event-outside","handlebars","event-custom","timers","moodle-editor_atto-menu"]},"moodle-editor_atto-menu":{"requires":["moodle-core-notification-dialogue","node","event","event-custom"]},"moodle-report_eventlist-eventfilter":{"requires":["base","event","node","node-event-delegate","datatable","autocomplete","autocomplete-filters"]},"moodle-report_loglive-fetchlogs":{"requires":["base","event","node","io","node-event-delegate"]},"moodle-gradereport_grader-gradereporttable":{"requires":["base","node","event","handlebars","overlay","event-hover"]},"moodle-gradereport_history-userselector":{"requires":["escape","event-delegate","event-key","handlebars","io-base","json-parse","moodle-core-notification-dialogue"]},"moodle-tool_capability-search":{"requires":["base","node"]},"moodle-tool_lp-dragdrop-reorder":{"requires":["moodle-core-dragdrop"]},"moodle-tool_monitor-dropdown":{"requires":["base","event","node"]},"moodle-assignfeedback_editpdf-editor":{"requires":["base","event","node","io","graphics","json","event-move","event-resize","transition","querystring-stringify-simple","moodle-core-notification-dialog","moodle-core-notification-alert","moodle-core-notification-warning","moodle-core-notification-exception","moodle-core-notification-ajaxexception"]},"moodle-atto_accessibilitychecker-button":{"requires":["color-base","moodle-editor_atto-plugin"]},"moodle-atto_accessibilityhelper-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_align-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_bold-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_charmap-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_clear-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_collapse-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_emojipicker-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_emoticon-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_equation-button":{"requires":["moodle-editor_atto-plugin","moodle-core-event","io","event-valuechange","tabview","array-extras"]},"moodle-atto_h5p-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_html-beautify":{},"moodle-atto_html-button":{"requires":["promise","moodle-editor_atto-plugin","moodle-atto_html-beautify","moodle-atto_html-codemirror","event-valuechange"]},"moodle-atto_html-codemirror":{"requires":["moodle-atto_html-codemirror-skin"]},"moodle-atto_image-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_indent-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_italic-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_link-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_managefiles-usedfiles":{"requires":["node","escape"]},"moodle-atto_managefiles-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_media-button":{"requires":["moodle-editor_atto-plugin","moodle-form-shortforms"]},"moodle-atto_noautolink-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_orderedlist-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_recordrtc-button":{"requires":["moodle-editor_atto-plugin","moodle-atto_recordrtc-recording"]},"moodle-atto_recordrtc-recording":{"requires":["moodle-atto_recordrtc-button"]},"moodle-atto_rtl-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_strike-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_subscript-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_superscript-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_table-button":{"requires":["moodle-editor_atto-plugin","moodle-editor_atto-menu","event","event-valuechange"]},"moodle-atto_title-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_underline-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_undo-button":{"requires":["moodle-editor_atto-plugin"]},"moodle-atto_unorderedlist-button":{"requires":["moodle-editor_atto-plugin"]}}},"gallery":{"name":"gallery","base":"https:\/\/iibflms.digivarsity.com\/lib\/yuilib\/gallery\/","combine":true,"comboBase":"https:\/\/iibflms.digivarsity.com\/theme\/yui_combo.php?","ext":false,"root":"gallery\/1786041251\/","patterns":{"gallery-":{"group":"gallery"}}}},"modules":{"core_filepicker":{"name":"core_filepicker","fullpath":"https:\/\/iibflms.digivarsity.com\/lib\/javascript.php\/1786041251\/repository\/filepicker.js","requires":["base","node","node-event-simulate","json","async-queue","io-base","io-upload-iframe","io-form","yui2-treeview","panel","cookie","datatable","datatable-sort","resize-plugin","dd-plugin","escape","moodle-core_filepicker","moodle-core-notification-dialogue"]},"core_comment":{"name":"core_comment","fullpath":"https:\/\/iibflms.digivarsity.com\/lib\/javascript.php\/1786041251\/comment\/comment.js","requires":["base","io-base","node","json","yui2-animation","overlay","escape"]},"mathjax":{"name":"mathjax","fullpath":"https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/mathjax\/2.7.2\/MathJax.js?delayStartupUntil=configured"}}};
M.yui.loader = {modules: {}};

//]]>
</script>
<script type="text/javascript">
//<![CDATA[
var scormplayerdata = {"launch":false,"currentorg":"","sco":0,"scorm":0,"courseid":"155","cwidth":"100","cheight":"500","popupoptions":"scrollbars=0,directories=0,location=0,menubar=0,toolbar=0,status=0"};
//]]>
</script>

<style>
/* hide Feedback activity Preview Questions button */
div.feedback_description div.navitem:first-of-type a.btn { display: none; }

/* show Feedback activity Edit Questions button in Edit Mode */
body.editing div.feedback_description div.navitem:first-of-type a.btn { display: inline-block; }

.section-activities-summary {
    display: none !important;
}

/* 🔥 Hide RemUI course progress circle (exact element) */
div.remui-course-progress.pie-progress.pie_progress {
    display: none !important;
}

</style>

<link href='https://fonts.googleapis.com/css?family=Open Sans:300,400,500,600,700,300italic' rel='stylesheet'
        type='text/css'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body  id="page-mod-scorm-player" class="forcejavascript format-topics  path-mod path-mod-scorm chrome dir-ltr lang-en yui-skin-sam yui3-skin-sam iibflms-digivarsity-com pagelayout-embedded course-155 context-20151 cmid-5103 category-3 ">

<div>
    <a class="sr-only sr-only-focusable" href="#maincontent">Skip to main content</a>
</div><script type="text/javascript" src="https://iibflms.digivarsity.com/lib/javascript.php/1786041251/lib/babel-polyfill/polyfill.min.js"></script>
<script type="text/javascript" src="https://iibflms.digivarsity.com/lib/javascript.php/1786041251/lib/mdn-polyfills/polyfill.js"></script>
<script type="text/javascript" src="https://iibflms.digivarsity.com/theme/yui_combo.php?rollup/3.17.2/yui-moodlesimple-min.js"></script><script type="text/javascript" src="https://iibflms.digivarsity.com/lib/javascript.php/1786041251/lib/javascript-static.js"></script>
<script type="text/javascript" src="https://iibflms.digivarsity.com/lib/javascript.php/1786041251/mod/scorm/request.js"></script>
<script type="text/javascript" src="https://iibflms.digivarsity.com/lib/javascript.php/1786041251/lib/cookies.js"></script>
<script type="text/javascript" src="https://iibflms.digivarsity.com/lib/javascript.php/1786041251/mod/scorm/datamodels/scorm_12.js"></script>
<script type="text/javascript">
//<![CDATA[
document.body.className += ' jsenabled';
//]]>
</script>


<div id="page">
    <div id="page-content">
        <div role="main"><span id="maincontent"></span><h2>Unit 1- Indian Economy and Economic Planning</h2><div id="scormpage"><div id="tocbox"><div id="scormapi-parent"><script id="external-scormapi" type="text/JavaScript"></script></div><div id="toctree"><div class="yui3-g-r" id="scorm_layout"><div class="yui3-u-1-5 loading" id="scorm_toc"><div id="scorm_toc_title"></div><div id="scorm_tree"><ul><li><a data-scoid="784" title="a=386&amp;scoid=784&amp;currentorg=&amp;mode=&amp;attempt=1"><i class="icon fa fa-pause fa-fw "  title="Incomplete - Suspended" aria-label="Incomplete - Suspended"></i>&nbsp;Indian Economy and Indian Financial System – IE&amp;IFS&nbsp;</a></li></ul></div></div><div class="loading" id="scorm_toc_toggle"><button id="scorm_toc_toggle_btn"></button></div><div id="scorm_content"><div id="scorm_navpanel"></div></div></div></div></div><noscript><div id="noscript">Your browser does not support JavaScript or it has JavaScript support disabled. This SCORM package may not play or save data correctly.</div></noscript></div><noscript><div class="box py-3 generalbox boxaligncenter forcejavascriptmessage">JavaScript is required to view this object, please enable JavaScript in your browser and try again.</div></noscript></div>
    </div>
</div>
<script type="text/javascript">
//<![CDATA[
var require = {
    baseUrl : 'https://iibflms.digivarsity.com/lib/requirejs.php/1786041251/',
    // We only support AMD modules with an explicit define() statement.
    enforceDefine: true,
    skipDataMain: true,
    waitSeconds : 0,

    paths: {
        jquery: 'https://iibflms.digivarsity.com/lib/javascript.php/1786041251/lib/jquery/jquery-3.4.1.min',
        jqueryui: 'https://iibflms.digivarsity.com/lib/javascript.php/1786041251/lib/jquery/ui-1.12.1/jquery-ui.min',
        jqueryprivate: 'https://iibflms.digivarsity.com/lib/javascript.php/1786041251/lib/requirejs/jquery-private'
    },

    // Custom jquery config map.
    map: {
      // '*' means all modules will get 'jqueryprivate'
      // for their 'jquery' dependency.
      '*': { jquery: 'jqueryprivate' },
      // Stub module for 'process'. This is a workaround for a bug in MathJax (see MDL-60458).
      '*': { process: 'core/first' },

      // 'jquery-private' wants the real jQuery module
      // though. If this line was not here, there would
      // be an unresolvable cyclic dependency.
      jqueryprivate: { jquery: 'jquery' }
    }
};

//]]>
</script>
<script type="text/javascript" src="https://iibflms.digivarsity.com/lib/javascript.php/1786041251/lib/requirejs/require.min.js"></script>
<script type="text/javascript">
//<![CDATA[
M.util.js_pending("core/first");require(['core/first'], function() {
;
require(["media_videojs/loader"], function(loader) {
    loader.setUp(function(videojs) {
        videojs.options.flash.swf = "https://iibflms.digivarsity.com/media/player/videojs/videojs/video-js.swf";
videojs.addLanguage('en', {
  "Audio Player": "Audio Player",
  "Video Player": "Video Player",
  "Play": "Play",
  "Pause": "Pause",
  "Replay": "Replay",
  "Current Time": "Current Time",
  "Duration": "Duration",
  "Remaining Time": "Remaining Time",
  "Stream Type": "Stream Type",
  "LIVE": "LIVE",
  "Seek to live, currently behind live": "Seek to live, currently behind live",
  "Seek to live, currently playing live": "Seek to live, currently playing live",
  "Loaded": "Loaded",
  "Progress": "Progress",
  "Progress Bar": "Progress Bar",
  "progress bar timing: currentTime={1} duration={2}": "{1} of {2}",
  "Fullscreen": "Fullscreen",
  "Non-Fullscreen": "Non-Fullscreen",
  "Mute": "Mute",
  "Unmute": "Unmute",
  "Playback Rate": "Playback Rate",
  "Subtitles": "Subtitles",
  "subtitles off": "subtitles off",
  "Captions": "Captions",
  "captions off": "captions off",
  "Chapters": "Chapters",
  "Descriptions": "Descriptions",
  "descriptions off": "descriptions off",
  "Audio Track": "Audio Track",
  "Volume Level": "Volume Level",
  "You aborted the media playback": "You aborted the media playback",
  "A network error caused the media download to fail part-way.": "A network error caused the media download to fail part-way.",
  "The media could not be loaded, either because the server or network failed or because the format is not supported.": "The media could not be loaded, either because the server or network failed or because the format is not supported.",
  "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.",
  "No compatible source was found for this media.": "No compatible source was found for this media.",
  "The media is encrypted and we do not have the keys to decrypt it.": "The media is encrypted and we do not have the keys to decrypt it.",
  "Play Video": "Play Video",
  "Close": "Close",
  "Close Modal Dialog": "Close Modal Dialog",
  "Modal Window": "Modal Window",
  "This is a modal window": "This is a modal window",
  "This modal can be closed by pressing the Escape key or activating the close button.": "This modal can be closed by pressing the Escape key or activating the close button.",
  ", opens captions settings dialog": ", opens captions settings dialog",
  ", opens subtitles settings dialog": ", opens subtitles settings dialog",
  ", opens descriptions settings dialog": ", opens descriptions settings dialog",
  ", selected": ", selected",
  "captions settings": "captions settings",
  "subtitles settings": "subititles settings",
  "descriptions settings": "descriptions settings",
  "Text": "Text",
  "White": "White",
  "Black": "Black",
  "Red": "Red",
  "Green": "Green",
  "Blue": "Blue",
  "Yellow": "Yellow",
  "Magenta": "Magenta",
  "Cyan": "Cyan",
  "Background": "Background",
  "Window": "Window",
  "Transparent": "Transparent",
  "Semi-Transparent": "Semi-Transparent",
  "Opaque": "Opaque",
  "Font Size": "Font Size",
  "Text Edge Style": "Text Edge Style",
  "None": "None",
  "Raised": "Raised",
  "Depressed": "Depressed",
  "Uniform": "Uniform",
  "Dropshadow": "Dropshadow",
  "Font Family": "Font Family",
  "Proportional Sans-Serif": "Proportional Sans-Serif",
  "Monospace Sans-Serif": "Monospace Sans-Serif",
  "Proportional Serif": "Proportional Serif",
  "Monospace Serif": "Monospace Serif",
  "Casual": "Casual",
  "Script": "Script",
  "Small Caps": "Small Caps",
  "Reset": "Reset",
  "restore all settings to the default values": "restore all settings to the default values",
  "Done": "Done",
  "Caption Settings Dialog": "Caption Settings Dialog",
  "Beginning of dialog window. Escape will cancel and close the window.": "Beginning of dialog window. Escape will cancel and close the window.",
  "End of dialog window.": "End of dialog window.",
  "{1} is loading.": "{1} is loading."
});

    });
});;

require(['theme_remui/loader']);
;
M.util.js_pending('core/network'); require(['core/network'], function(amd) {amd.keepalive(30, 10, "The SCORM player has determined that your Internet connection is unreliable or has been interrupted. If you continue in this SCORM activity, your progress may not be saved.<br \/>\nYou should exit the activity now, and return when you have a dependable Internet connection."); M.util.js_complete('core/network');});;
M.util.js_pending('core/notification'); require(['core/notification'], function(amd) {amd.init(20151, []); M.util.js_complete('core/notification');});;
M.util.js_pending('core/log'); require(['core/log'], function(amd) {amd.setConfig({"level":"warn"}); M.util.js_complete('core/log');});;
M.util.js_pending('core/page_global'); require(['core/page_global'], function(amd) {amd.init(); M.util.js_complete('core/page_global');});M.util.js_complete("core/first");
});
//]]>
</script>
<script type="text/javascript">
//<![CDATA[
M.yui.add_module({"mod_scorm":{"name":"mod_scorm","fullpath":"https:\/\/iibflms.digivarsity.com\/lib\/javascript.php\/1786041251\/mod\/scorm\/module.js","requires":["json"]}});

//]]>
</script>
<script type="text/javascript">
//<![CDATA[
M.str = {"moodle":{"lastmodified":"Last modified","name":"Name","error":"Error","info":"Information","yes":"Yes","no":"No","cancel":"Cancel","hide":"Hide","show":"Show","confirm":"Confirm","areyousure":"Are you sure?","closebuttontitle":"Close","unknownerror":"Unknown error","file":"File","url":"URL"},"repository":{"type":"Type","size":"Size","invalidjson":"Invalid JSON string","nofilesattached":"No files attached","filepicker":"File picker","logout":"Logout","nofilesavailable":"No files available","norepositoriesavailable":"Sorry, none of your current repositories can return files in the required format.","fileexistsdialogheader":"File exists","fileexistsdialog_editor":"A file with that name has already been attached to the text you are editing.","fileexistsdialog_filemanager":"A file with that name has already been attached","renameto":"Rename to \"{$a}\"","referencesexist":"There are {$a} alias\/shortcut files that use this file as their source","select":"Select"},"admin":{"confirmdeletecomments":"You are about to delete comments, are you sure?","confirmation":"Confirmation"},"scorm":{"navigation":"Navigation","toc":"TOC","popupsblocked":"It appears that popup windows are blocked, stopping this SCORM package from playing. Please check your browser settings before trying again."},"debug":{"debuginfo":"Debug info","line":"Line","stacktrace":"Stack trace"},"langconfig":{"labelsep":": "}};
//]]>
</script>
<script type="text/javascript">
//<![CDATA[
(function() {Y.use("moodle-filter_mathjaxloader-loader",function() {M.filter_mathjaxloader.configure({"mathjaxconfig":"MathJax.Hub.Config({\r\n    config: [\"Accessible.js\", \"Safe.js\"],\r\n    errorSettings: { message: [\"!\"] },\r\n    skipStartupTypeset: true,\r\n    messageStyle: \"none\"\r\n});\r\n","lang":"en"});
});
M.util.help_popups.setup(Y);
 M.util.js_pending('random6a8907366dca62'); Y.use('mod_scorm', function(Y) { M.mod_scorm.init(Y, 2, "-100", "-100", "1", 767, "TOC", false, "784", "{\"783\":{\"identifier\":\"Indian_Economy_and_Indian_Financial_System_\\u2013_IE&IFS_ORG\",\"launch\":\"\",\"title\":\"Indian Economy and Indian Financial System \\u2013 IE&IFS\",\"url\":\"a=386&scoid=783&currentorg=&mode=&attempt=1\",\"parent\":\"\\\/\",\"isvisible\":\"true\",\"nextscoid\":\"784\"},\"784\":{\"identifier\":\"Various_Banking_Services_SCO\",\"launch\":\"index_lms.html\",\"title\":\"Indian Economy and Indian Financial System \\u2013 IE&IFS\",\"url\":\"a=386&scoid=784&currentorg=&mode=&attempt=1\",\"parent\":\"Indian_Economy_and_Indian_Financial_System_\\u2013_IE&IFS_ORG\",\"isvisible\":\"true\",\"parameters\":\"\",\"parentscoid\":\"783\",\"prevscoid\":\"783\"}}");  M.util.js_complete('random6a8907366dca62'); });
M.scorm_api.init(Y, {"783":{"cmi.core.student_id":"803062594","cmi.core.student_name":"Vishal .","cmi.core.credit":"credit","cmi.core.entry":"ab-initio","cmi.core.lesson_mode":"normal","cmi.launch_data":"","cmi.student_data.mastery_score":"","cmi.student_data.max_time_allowed":"","cmi.student_data.time_limit_action":"","cmi.core.total_time":"00:00:00","cmi.core.lesson_location":"","cmi.core.lesson_status":"","cmi.core.score.raw":"","cmi.core.score.max":"","cmi.core.score.min":"","cmi.core.exit":"","cmi.suspend_data":"","cmi.comments":"","cmi.student_preference.language":"","cmi.student_preference.audio":"0","cmi.student_preference.speed":"0","cmi.student_preference.text":"0"},"784":{"cmi.core.student_id":"803062594","cmi.core.student_name":"Vishal .","cmi.core.credit":"credit","cmi.core.entry":"resume","cmi.core.lesson_mode":"normal","cmi.launch_data":"","cmi.student_data.mastery_score":"70","cmi.student_data.max_time_allowed":"","cmi.student_data.time_limit_action":"","cmi.core.total_time":"00:05:15.79","cmi.core.lesson_location":"","cmi.core.lesson_status":"incomplete","cmi.core.score.raw":"","cmi.core.score.max":"","cmi.core.score.min":"","cmi.core.exit":"suspend","cmi.suspend_data":"2S2g60h1708090a0b0c0IH1001314z01012011120101301014011140121401314~2x1g00000000000000001^1^1^1^1^1^1^1^1^1^1^1^1^1^101010101316101^v_player.6kPXWyJ1Bqz.6mKlr884wz61^1^0000300000000002000","cmi.comments":"","cmi.student_preference.language":"","cmi.student_preference.audio":"0","cmi.student_preference.speed":"0","cmi.student_preference.text":"0"}}, {"783":"","784":""}, {"783":"","784":""}, "^[\\u0000-\\uFFFF]{0,64000}$", "^[\\u0000-\\uFFFF]{0,64000}$", false, "0", "386", "https:\/\/iibflms.digivarsity.com", "zXAEo05HRy", "784", "1", "normal", "", "", false, true, "1");
 M.util.js_pending('random6a8907366dca64'); Y.on('domready', function() { M.util.js_complete("init");  M.util.js_complete('random6a8907366dca64'); });
})();
//]]>
</script>

</body>
</html>