(venv) PS C:\IndraOS\backend> uvicorn main:app
Traceback (most recent call last):
  File "<frozen runpy>", line 198, in _run_module_as_main
  File "<frozen runpy>", line 88, in _run_code
  File "C:\IndraOS\backend\venv\Scripts\uvicorn.exe\__main__.py", line 7, in <module>
  File "C:\IndraOS\backend\venv\Lib\site-packages\click\core.py", line 1442, in __call__
    return self.main(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\IndraOS\backend\venv\Lib\site-packages\click\core.py", line 1363, in main
    rv = self.invoke(ctx)
         ^^^^^^^^^^^^^^^^
  File "C:\IndraOS\backend\venv\Lib\site-packages\click\core.py", line 1226, in invoke
    return ctx.invoke(self.callback, **ctx.params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\IndraOS\backend\venv\Lib\site-packages\click\core.py", line 794, in invoke
    return callback(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\IndraOS\backend\venv\Lib\site-packages\uvicorn\main.py", line 413, in main
    run(
  File "C:\IndraOS\backend\venv\Lib\site-packages\uvicorn\main.py", line 580, in run
    server.run()
  File "C:\IndraOS\backend\venv\Lib\site-packages\uvicorn\server.py", line 67, in run
    return asyncio.run(self.serve(sockets=sockets))
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\runners.py", line 194, in run
    with Runner(debug=debug, loop_factory=loop_factory) as runner:
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\runners.py", line 58, in __enter__
    self._lazy_init()
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\runners.py", line 137, in _lazy_init
    self._loop = events.new_event_loop()
                 ^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\events.py", line 823, in new_event_loop
    return get_event_loop_policy().new_event_loop()
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\events.py", line 720, in new_event_loop
    return self._loop_factory()
           ^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\windows_events.py", line 316, in __init__
    super().__init__(proactor)
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\proactor_events.py", line 640, in __init__
    self._make_self_pipe()
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\proactor_events.py", line 787, in _make_self_pipe
    self._ssock, self._csock = socket.socketpair()
                               ^^^^^^^^^^^^^^^^^^^
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\socket.py", line 615, in _fallback_socketpair
    lsock.bind((host, 0))
OSError: [WinError 10055] Une opération sur un socket n’a pas pu être effectuée car le système ne disposait pas de suffisamment d’espace dans la mémoire tampon ou parce que la file d’attente était saturée
sys:1: RuntimeWarning: coroutine 'Server.serve' was never awaited
Exception ignored in: <function BaseEventLoop.__del__ at 0x000001DE7703B4C0>
Traceback (most recent call last):
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\base_events.py", line 732, in __del__
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\proactor_events.py", line 697, in close
  File "C:\Users\ASUS\AppData\Local\Programs\Python\Python312\Lib\asyncio\proactor_events.py", line 779, in _close_self_pipe
AttributeError: 'ProactorEventLoop' object has no attribute '_ssock'
(venv) PS C:\IndraOS\backend> 