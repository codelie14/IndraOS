(venv) PS C:\IndraOS\backend> uvicorn main:app
INFO:     Started server process [9196]
INFO:     Waiting for application startup.
Starting IndraOS Backend...
Database tables created successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     127.0.0.1:53189 - "GET /api/services?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53188 - "GET /api/services?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53203 - "GET /api/services?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53204 - "GET /api/services?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53214 - "WebSocket /api/ws/system-metrics" [accepted]
INFO:     connection open
INFO:     127.0.0.1:53217 - "GET /api/services?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53218 - "GET /api/services?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53223 - "GET /api/processes?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53223 - "GET /api/processes?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53225 - "GET /api/processes?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53226 - "GET /api/processes?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53239 - "GET /api/processes?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53240 - "GET /api/processes?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53240 - "GET /api/services?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53240 - "GET /api/services?skip=0&limit=1000 HTTP/1.1" 200 OK
INFO:     Shutting down
INFO:     connection closed
INFO:     Waiting for background tasks to complete. (CTRL+C to force quit)
Client disconnected from system metrics websocket
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "C:\IndraOS\backend\venv\Lib\site-packages\uvicorn\protocols\websockets\websockets_impl.py", line 244, in run_asgi
    result = await self.app(self.scope, self.asgi_receive, self.asgi_send)  # type: ignore[func-returns-value]
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\IndraOS\backend\venv\Lib\site-packages\uvicorn\middleware\proxy_headers.py", line 60, in __call__
    return await self.app(scope, receive, send)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\IndraOS\backend\venv\Lib\site-packages\fastapi\applications.py", line 1054, in __call__
    await super().__call__(scope, receive, send)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\applications.py", line 113, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\middleware\errors.py", line 151, in __call__
    await self.app(scope, receive, send)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\middleware\cors.py", line 77, in __call__
    await self.app(scope, receive, send)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\middleware\exceptions.py", line 63, in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\routing.py", line 716, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\routing.py", line 736, in app
    await route.handle(scope, receive, send)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\routing.py", line 364, in handle
    await self.app(scope, receive, send)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\routing.py", line 97, in app
    await wrap_app_handling_exceptions(app, session)(scope, receive, send)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\routing.py", line 95, in app
    await func(session)
  File "C:\IndraOS\backend\venv\Lib\site-packages\fastapi\routing.py", line 384, in app
    await dependant.call(**solved_result.values)
  File "C:\IndraOS\backend\api\endpoints\system.py", line 34, in websocket_system_metrics
    await websocket.close()
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\websockets.py", line 181, in close
    await self.send({"type": "websocket.close", "code": code, "reason": reason or ""})
  File "C:\IndraOS\backend\venv\Lib\site-packages\starlette\websockets.py", line 98, in send
    raise RuntimeError('Cannot call "send" once a close message has been sent.')
RuntimeError: Cannot call "send" once a close message has been sent.
INFO:     Waiting for application shutdown.
Shutting down IndraOS Backend...
INFO:     Application shutdown complete.
INFO:     Finished server process [9196]
(venv) PS C:\IndraOS\backend> 