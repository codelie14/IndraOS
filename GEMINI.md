C:\IndraOS\frontend\components\ui\skeleton.tsx:8 In HTML, <div> cannot be a descendant of <p>.
This will cause a hydration error.

  ...
    <InnerLayoutRouter url="/ai-analysis" tree={[...]} cacheNode={{lazyData:null, ...}} segmentPath={[...]}>
      <SegmentViewNode type="page" pagePath="ai-analysi...">
        <SegmentTrieNode>
        <ClientPageRoot Component={function AIAnalysisPage} searchParams={{}} params={{}}>
          <AIAnalysisPage params={Promise} searchParams={Promise}>
            <motion.div className="p-6 space-y-6" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}>
              <div className="p-6 space-y-6" style={{opacity:0}} ref={function}>
                <div>
                <div>
                <div className="grid grid-...">
                  <div>
                  <_c className="bg-[var(--...">
                    <div ref={null} className="rounded-lg...">
                      <_c2>
                      <_c8 className="p-6 space-y-6">
                        <div ref={null} className="p-6 space-y-6">
                          <div>
                          <div className="p-4 bg-[va...">
                            <p>
>                           <p className="text-xs text-muted-foreground">
                              <Skeleton className="h-4 w-3/4">
>                               <div className="animate-pulse rounded-md bg-muted h-4 w-3/4">
      ...

overrideMethod @ hook.js:608
error @ intercept-console-error.js:57
validateDOMNesting @ react-dom-client.development.js:2662
beginWork @ react-dom-client.development.js:11072
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:323
Skeleton @ C:\IndraOS\frontend\components\ui\skeleton.tsx:8
react_stack_bottom_frame @ react-dom-client.development.js:23584
renderWithHooksAgain @ react-dom-client.development.js:6893
renderWithHooks @ react-dom-client.development.js:6805
updateFunctionComponent @ react-dom-client.development.js:9247
beginWork @ react-dom-client.development.js:10858
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
<Skeleton>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:323
AIAnalysisPage @ C:\IndraOS\frontend\app\ai-analysis\page.tsx:146
react_stack_bottom_frame @ react-dom-client.development.js:23584
renderWithHooksAgain @ react-dom-client.development.js:6893
renderWithHooks @ react-dom-client.development.js:6805
updateFunctionComponent @ react-dom-client.development.js:9247
beginWork @ react-dom-client.development.js:10858
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
<AIAnalysisPage>
exports.jsx @ react-jsx-runtime.development.js:323
ClientPageRoot @ client-page.js:20
react_stack_bottom_frame @ react-dom-client.development.js:23584
renderWithHooksAgain @ react-dom-client.development.js:6893
renderWithHooks @ react-dom-client.development.js:6805
updateFunctionComponent @ react-dom-client.development.js:9247
beginWork @ react-dom-client.development.js:10807
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
Function.all @ VM3437 <anonymous>:1
Function.all @ VM3437 <anonymous>:1
initializeElement @ react-server-dom-webpack-client.browser.development.js:1343
eval @ react-server-dom-webpack-client.browser.development.js:3066
initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1246
resolveModelChunk @ react-server-dom-webpack-client.browser.development.js:1101
processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2899
processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2766
processBinaryChunk @ react-server-dom-webpack-client.browser.development.js:2969
progress @ react-server-dom-webpack-client.browser.development.js:3233
"use server"
ResponseInstance @ react-server-dom-webpack-client.browser.development.js:2041
createResponseFromOptions @ react-server-dom-webpack-client.browser.development.js:3094
exports.createFromReadableStream @ react-server-dom-webpack-client.browser.development.js:3478
eval @ app-index.js:130
(app-pages-browser)/./node_modules/next/dist/client/app-index.js @ main-app.js?v=1757545822027:160
options.factory @ webpack.js:1
__webpack_require__ @ webpack.js:1
fn @ webpack.js:1
eval @ app-next-dev.js:14
eval @ app-bootstrap.js:59
loadScriptsInSequence @ app-bootstrap.js:24
appBootstrap @ app-bootstrap.js:53
eval @ app-next-dev.js:13
(app-pages-browser)/./node_modules/next/dist/client/app-next-dev.js @ main-app.js?v=1757545822027:182
options.factory @ webpack.js:1
__webpack_require__ @ webpack.js:1
__webpack_exec__ @ main-app.js?v=1757545822027:1878
(anonymous) @ main-app.js?v=1757545822027:1879
webpackJsonpCallback @ webpack.js:1
(anonymous) @ main-app.js?v=1757545822027:9
C:\IndraOS\frontend\app\ai-analysis\page.tsx:145 <p> cannot contain a nested <div>.
See this log for the ancestor stack trace.
overrideMethod @ hook.js:608
error @ intercept-console-error.js:57
eval @ react-dom-client.development.js:2675
runWithFiberInDEV @ react-dom-client.development.js:872
validateDOMNesting @ react-dom-client.development.js:2674
beginWork @ react-dom-client.development.js:11072
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
<p>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:323
AIAnalysisPage @ C:\IndraOS\frontend\app\ai-analysis\page.tsx:145
react_stack_bottom_frame @ react-dom-client.development.js:23584
renderWithHooksAgain @ react-dom-client.development.js:6893
renderWithHooks @ react-dom-client.development.js:6805
updateFunctionComponent @ react-dom-client.development.js:9247
beginWork @ react-dom-client.development.js:10858
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
<AIAnalysisPage>
exports.jsx @ react-jsx-runtime.development.js:323
ClientPageRoot @ client-page.js:20
react_stack_bottom_frame @ react-dom-client.development.js:23584
renderWithHooksAgain @ react-dom-client.development.js:6893
renderWithHooks @ react-dom-client.development.js:6805
updateFunctionComponent @ react-dom-client.development.js:9247
beginWork @ react-dom-client.development.js:10807
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
Function.all @ VM3437 <anonymous>:1
Function.all @ VM3437 <anonymous>:1
initializeElement @ react-server-dom-webpack-client.browser.development.js:1343
eval @ react-server-dom-webpack-client.browser.development.js:3066
initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1246
resolveModelChunk @ react-server-dom-webpack-client.browser.development.js:1101
processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2899
processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2766
processBinaryChunk @ react-server-dom-webpack-client.browser.development.js:2969
progress @ react-server-dom-webpack-client.browser.development.js:3233
"use server"
ResponseInstance @ react-server-dom-webpack-client.browser.development.js:2041
createResponseFromOptions @ react-server-dom-webpack-client.browser.development.js:3094
exports.createFromReadableStream @ react-server-dom-webpack-client.browser.development.js:3478
eval @ app-index.js:130
(app-pages-browser)/./node_modules/next/dist/client/app-index.js @ main-app.js?v=1757545822027:160
options.factory @ webpack.js:1
__webpack_require__ @ webpack.js:1
fn @ webpack.js:1
eval @ app-next-dev.js:14
eval @ app-bootstrap.js:59
loadScriptsInSequence @ app-bootstrap.js:24
appBootstrap @ app-bootstrap.js:53
eval @ app-next-dev.js:13
(app-pages-browser)/./node_modules/next/dist/client/app-next-dev.js @ main-app.js?v=1757545822027:182
options.factory @ webpack.js:1
__webpack_require__ @ webpack.js:1
__webpack_exec__ @ main-app.js?v=1757545822027:1878
(anonymous) @ main-app.js?v=1757545822027:1879
webpackJsonpCallback @ webpack.js:1
(anonymous) @ main-app.js?v=1757545822027:9
react-dom-client.development.js:4506 Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch
    at throwOnHydrationMismatch (react-dom-client.development.js:4506:11)
    at beginWork (react-dom-client.development.js:11107:17)
    at runWithFiberInDEV (react-dom-client.development.js:872:30)
    at performUnitOfWork (react-dom-client.development.js:15727:22)
    at workLoopConcurrentByScheduler (react-dom-client.development.js:15721:9)
    at renderRootConcurrent (react-dom-client.development.js:15696:15)
    at performWorkOnRoot (react-dom-client.development.js:14990:13)
    at performWorkOnRootViaSchedulerTask (react-dom-client.development.js:16816:7)
    at MessagePort.performWorkUntilDeadline (scheduler.development.js:45:48)
throwOnHydrationMismatch @ react-dom-client.development.js:4506
beginWork @ react-dom-client.development.js:11107
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:323
Skeleton @ C:\IndraOS\frontend\components\ui\skeleton.tsx:8
react_stack_bottom_frame @ react-dom-client.development.js:23584
renderWithHooksAgain @ react-dom-client.development.js:6893
renderWithHooks @ react-dom-client.development.js:6805
updateFunctionComponent @ react-dom-client.development.js:9247
beginWork @ react-dom-client.development.js:10858
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
<Skeleton>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:323
AIAnalysisPage @ C:\IndraOS\frontend\app\ai-analysis\page.tsx:146
react_stack_bottom_frame @ react-dom-client.development.js:23584
renderWithHooksAgain @ react-dom-client.development.js:6893
renderWithHooks @ react-dom-client.development.js:6805
updateFunctionComponent @ react-dom-client.development.js:9247
beginWork @ react-dom-client.development.js:10858
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
<AIAnalysisPage>
exports.jsx @ react-jsx-runtime.development.js:323
ClientPageRoot @ client-page.js:20
react_stack_bottom_frame @ react-dom-client.development.js:23584
renderWithHooksAgain @ react-dom-client.development.js:6893
renderWithHooks @ react-dom-client.development.js:6805
updateFunctionComponent @ react-dom-client.development.js:9247
beginWork @ react-dom-client.development.js:10807
runWithFiberInDEV @ react-dom-client.development.js:872
performUnitOfWork @ react-dom-client.development.js:15727
workLoopConcurrentByScheduler @ react-dom-client.development.js:15721
renderRootConcurrent @ react-dom-client.development.js:15696
performWorkOnRoot @ react-dom-client.development.js:14990
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
Function.all @ VM3437 <anonymous>:1
Function.all @ VM3437 <anonymous>:1
initializeElement @ react-server-dom-webpack-client.browser.development.js:1343
eval @ react-server-dom-webpack-client.browser.development.js:3066
initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1246
resolveModelChunk @ react-server-dom-webpack-client.browser.development.js:1101
processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2899
processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2766
processBinaryChunk @ react-server-dom-webpack-client.browser.development.js:2969
progress @ react-server-dom-webpack-client.browser.development.js:3233
"use server"
ResponseInstance @ react-server-dom-webpack-client.browser.development.js:2041
createResponseFromOptions @ react-server-dom-webpack-client.browser.development.js:3094
exports.createFromReadableStream @ react-server-dom-webpack-client.browser.development.js:3478
eval @ app-index.js:130
(app-pages-browser)/./node_modules/next/dist/client/app-index.js @ main-app.js?v=1757545822027:160
options.factory @ webpack.js:1
__webpack_require__ @ webpack.js:1
fn @ webpack.js:1
eval @ app-next-dev.js:14
eval @ app-bootstrap.js:59
loadScriptsInSequence @ app-bootstrap.js:24
appBootstrap @ app-bootstrap.js:53
eval @ app-next-dev.js:13
(app-pages-browser)/./node_modules/next/dist/client/app-next-dev.js @ main-app.js?v=1757545822027:182
options.factory @ webpack.js:1
__webpack_require__ @ webpack.js:1
__webpack_exec__ @ main-app.js?v=1757545822027:1878
(anonymous) @ main-app.js?v=1757545822027:1879
webpackJsonpCallback @ webpack.js:1
(anonymous) @ main-app.js?v=1757545822027:9
C:\IndraOS\frontend\lib\websocket.ts:86 WebSocket connection to 'ws://localhost:8000/api/ws/system-metrics' failed: WebSocket is closed before the connection is established.
disconnect @ C:\IndraOS\frontend\lib\websocket.ts:86
WebSocketProvider.useEffect @ C:\IndraOS\frontend\components\providers\WebSocketProvider.tsx:24
react_stack_bottom_frame @ react-dom-client.development.js:23681
runWithFiberInDEV @ react-dom-client.development.js:872
commitHookEffectListUnmount @ react-dom-client.development.js:12436
commitHookPassiveUnmountEffects @ react-dom-client.development.js:12477
disconnectPassiveEffect @ react-dom-client.development.js:14809
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14814
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
recursivelyTraverseDisconnectPassiveEffects @ react-dom-client.development.js:14800
disconnectPassiveEffect @ react-dom-client.development.js:14823
doubleInvokeEffectsOnFiber @ react-dom-client.development.js:16564
runWithFiberInDEV @ react-dom-client.development.js:872
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-dom-client.development.js:16530
commitDoubleInvokeEffectsInDEV @ react-dom-client.development.js:16575
flushPassiveEffects @ react-dom-client.development.js:16348
flushPendingEffects @ react-dom-client.development.js:16299
performSyncWorkOnRoot @ react-dom-client.development.js:16828
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16677
flushSpawnedWork @ react-dom-client.development.js:16274
commitRoot @ react-dom-client.development.js:15998
commitRootWhenReady @ react-dom-client.development.js:15228
performWorkOnRoot @ react-dom-client.development.js:15147
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16816
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
RootLayout @ layout.tsx:35
initializeElement @ react-server-dom-webpack-client.browser.development.js:1344
eval @ react-server-dom-webpack-client.browser.development.js:3066
initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1246
getOutlinedModel @ react-server-dom-webpack-client.browser.development.js:1634
parseModelString @ react-server-dom-webpack-client.browser.development.js:1993
eval @ react-server-dom-webpack-client.browser.development.js:2996
initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1246
resolveModelChunk @ react-server-dom-webpack-client.browser.development.js:1101
processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2899
processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2766
processBinaryChunk @ react-server-dom-webpack-client.browser.development.js:2969
progress @ react-server-dom-webpack-client.browser.development.js:3233
<RootLayout>
initializeFakeTask @ react-server-dom-webpack-client.browser.development.js:2529
initializeDebugInfo @ react-server-dom-webpack-client.browser.development.js:2554
initializeDebugChunk @ react-server-dom-webpack-client.browser.development.js:1193
processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2850
processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2766
processBinaryChunk @ react-server-dom-webpack-client.browser.development.js:2969
progress @ react-server-dom-webpack-client.browser.development.js:3233
"use server"
ResponseInstance @ react-server-dom-webpack-client.browser.development.js:2041
createResponseFromOptions @ react-server-dom-webpack-client.browser.development.js:3094
exports.createFromReadableStream @ react-server-dom-webpack-client.browser.development.js:3478
eval @ app-index.js:130
(app-pages-browser)/./node_modules/next/dist/client/app-index.js @ main-app.js?v=1757545822027:160
options.factory @ webpack.js:1
__webpack_require__ @ webpack.js:1
fn @ webpack.js:1
eval @ app-next-dev.js:14
eval @ app-bootstrap.js:59
loadScriptsInSequence @ app-bootstrap.js:24
appBootstrap @ app-bootstrap.js:53
eval @ app-next-dev.js:13
(app-pages-browser)/./node_modules/next/dist/client/app-next-dev.js @ main-app.js?v=1757545822027:182
options.factory @ webpack.js:1
__webpack_require__ @ webpack.js:1
__webpack_exec__ @ main-app.js?v=1757545822027:1878
(anonymous) @ main-app.js?v=1757545822027:1879
webpackJsonpCallback @ webpack.js:1
(anonymous) @ main-app.js?v=1757545822027:9
C:\IndraOS\frontend\lib\websocket.ts:49 WebSocket error: Event {isTrusted: true, type: 'error', target: WebSocket, currentTarget: WebSocket, eventPhase: 2, …}
overrideMethod @ hook.js:608
error @ intercept-console-error.js:57
ws.onerror @ C:\IndraOS\frontend\lib\websocket.ts:49
C:\IndraOS\frontend\lib\websocket.ts:54 WebSocket disconnected.
C:\IndraOS\frontend\lib\websocket.ts:69 WebSocket disconnected. Attempting to reconnect in 1s... (1/10)
C:\IndraOS\frontend\lib\websocket.ts:29 WebSocket connected successfully.
C:\IndraOS\frontend\lib\websocket.ts:29 WebSocket connected successfully.
