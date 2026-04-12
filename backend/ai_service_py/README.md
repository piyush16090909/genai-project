(base) PS D:\genaiproject> cd D:\genaiproject\backend\ai_service_py
>> py -3.11 -m venv .venv
>> .\.venv\Scripts\Activate.ps1
>> pip install -r requirements.txt
>> uvicorn main:app --host 0.0.0.0 --port 8001
No suitable Python runtime found
Pass --list (-0) to see all detected environments on your machine
or set environment variable PYLAUNCHER_ALLOW_INSTALL to use winget
or open the Microsoft Store to the requested version.
Collecting fastapi==0.115.6 (from -r requirements.txt (line 1))
  Using cached fastapi-0.115.6-py3-none-any.whl.metadata (27 kB)
Collecting uvicorn==0.30.6 (from -r requirements.txt (line 2))
  Using cached uvicorn-0.30.6-py3-none-any.whl.metadata (6.6 kB)
Collecting langchain==0.3.7 (from -r requirements.txt (line 3))
  Using cached langchain-0.3.7-py3-none-any.whl.metadata (7.1 kB)
Collecting langchain-mistralai==0.2.6 (from -r requirements.txt (line 4))
  Using cached langchain_mistralai-0.2.6-py3-none-any.whl.metadata (2.5 kB)
Collecting python-dotenv==1.0.1 (from -r requirements.txt (line 5))
  Using cached python_dotenv-1.0.1-py3-none-any.whl.metadata (23 kB)
Collecting starlette<0.42.0,>=0.40.0 (from fastapi==0.115.6->-r requirements.txt (line 1))
  Using cached starlette-0.41.3-py3-none-any.whl.metadata (6.0 kB)
Collecting pydantic!=1.8,!=1.8.1,!=2.0.0,!=2.0.1,!=2.1.0,<3.0.0,>=1.7.4 (from fastapi==0.115.6->-r requirements.txt (line 1))
  Using cached pydantic-2.12.5-py3-none-any.whl.metadata (90 kB)
Collecting typing-extensions>=4.8.0 (from fastapi==0.115.6->-r requirements.txt (line 1))
  Using cached typing_extensions-4.15.0-py3-none-any.whl.metadata (3.3 kB)
Collecting click>=7.0 (from uvicorn==0.30.6->-r requirements.txt (line 2))
  Using cached click-8.3.2-py3-none-any.whl.metadata (2.6 kB)
Collecting h11>=0.8 (from uvicorn==0.30.6->-r requirements.txt (line 2))
  Using cached h11-0.16.0-py3-none-any.whl.metadata (8.3 kB)
Collecting PyYAML>=5.3 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached pyyaml-6.0.3-cp313-cp313-win_amd64.whl.metadata (2.4 kB)
Collecting SQLAlchemy<3,>=1.4 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached sqlalchemy-2.0.49-cp313-cp313-win_amd64.whl.metadata (9.8 kB)
Collecting aiohttp<4.0.0,>=3.8.3 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached aiohttp-3.13.5-cp313-cp313-win_amd64.whl.metadata (8.4 kB)
Collecting langchain-core<0.4.0,>=0.3.15 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached langchain_core-0.3.84-py3-none-any.whl.metadata (3.2 kB)
Collecting langchain-text-splitters<0.4.0,>=0.3.0 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached langchain_text_splitters-0.3.11-py3-none-any.whl.metadata (1.8 kB)
Collecting langsmith<0.2.0,>=0.1.17 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached langsmith-0.1.147-py3-none-any.whl.metadata (14 kB)
Collecting numpy<2.0.0,>=1.26.0 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached numpy-1.26.4.tar.gz (15.8 MB)
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
  Installing backend dependencies ... done
  Preparing metadata (pyproject.toml) ... error
  error: subprocess-exited-with-error
  
  × Preparing metadata (pyproject.toml) did not run successfully.
  │ exit code: 1
  ╰─> [19 lines of output]
      + D:\genaiproject\backend\ai_service_py\.venv\Scripts\python.exe C:\Users\HP\AppData\Local\Temp\pip-install-wgdh7clx\numpy_57681525aa8140519e3674f41ac0644f\vendored-meson\meson\meson.py setup C:\Users\HP\AppData\Local\Temp\pip-install-wgdh7clx\numpy_57681525aa8140519e3674f41ac0644f C:\Users\HP\AppData\Local\Temp\pip-install-wgdh7clx\numpy_57681525aa8140519e3674f41ac0644f\.mesonpy-eypcmipp -Dbuildtype=release -Db_ndebug=if-release -Db_vscrt=md --native-file=C:\Users\HP\AppData\Local\Temp\pip-install-wgdh7clx\numpy_57681525aa8140519e3674f41ac0644f\.mesonpy-eypcmipp\meson-python-native-file.ini
      The Meson build system
      Version: 1.2.99
      Source dir: C:\Users\HP\AppData\Local\Temp\pip-install-wgdh7clx\numpy_57681525aa8140519e3674f41ac0644f
      Build dir: C:\Users\HP\AppData\Local\Temp\pip-install-wgdh7clx\numpy_57681525aa8140519e3674f41ac0644f\.mesonpy-eypcmipp
      Build type: native build
      Project name: NumPy
      Project version: 1.26.4
      C compiler for the host machine: gcc (gcc 6.3.0 "gcc (MinGW.org GCC-6.3.0-1) 6.3.0")
      C linker for the host machine: gcc ld.bfd 2.28
      C++ compiler for the host machine: c++ (gcc 6.3.0 "c++ (MinGW.org GCC-6.3.0-1) 6.3.0")
      C++ linker for the host machine: c++ ld.bfd 2.28
      Cython compiler for the host machine: cython (cython 3.0.12)
      Host machine cpu family: x86
      Host machine cpu: x86
      
      ..\meson.build:28:4: ERROR: Problem encountered: NumPy requires GCC >= 8.4
      
      A full log can be found at C:\Users\HP\AppData\Local\Temp\pip-install-wgdh7clx\numpy_57681525aa8140519e3674f41ac0644f\.mesonpy-eypcmipp\meson-logs\meson-log.txt
      [end of output]
  
  note: This error originates from a subprocess, and is likely not a problem with pip.
error: metadata-generation-failed

× Encountered error while generating package metadata.
╰─> numpy

note: This is an issue with the package mentioned above, not pip.
hint: See above for details.
uvicorn : The term 'uvicorn' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or 
if a path was included, verify that the path is correct and try again.
At line:5 char:1
+ uvicorn main:app --host 0.0.0.0 --port 8001
+ ~~~~~~~
    + CategoryInfo          : ObjectNotFound: (uvicorn:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
 
(.venv) (base) PS D:\genaiproject\backend\ai_service_py> 
(.venv) (base) PS D:\genaiproject\backend\ai_service_py> conda create -n ai311 python=3.11 -y
>> conda activate ai311
>> cd D:\genaiproject\backend\ai_service_py
>> pip install -r requirements.txt
>> uvicorn main:app --host 0.0.0.0 --port 8001
3 channel Terms of Service accepted
Retrieving notices: done
Channels:
 - defaults
Platform: win-64
Collecting package metadata (repodata.json): done
Solving environment: done


==> WARNING: A newer version of conda exists. <==
    current version: 25.11.1
    latest version: 26.3.1

Please update conda by running

    $ conda update -n base -c defaults conda



## Package Plan ##

  environment location: C:\Users\HP\anaconda3\envs\ai311

  added / updated specs:
    - python=3.11


The following packages will be downloaded:

    package                    |            build
    ---------------------------|-----------------
    bzip2-1.0.8                |       h2bbff1b_6          90 KB
    ca-certificates-2026.3.19  |       haa95532_0         126 KB
    libexpat-2.7.5             |       hd7fb8db_0         120 KB
    libffi-3.4.4               |       hd77b12b_1         122 KB
    libzlib-1.3.1              |       h02ab6af_0          64 KB
    openssl-3.5.6              |       hbb43b14_0         8.9 MB
    packaging-26.0             |  py311haa95532_0         197 KB
    pip-26.0.1                 |     pyhc872135_1         1.1 MB
    python-3.11.15             |       h1044e36_0        17.7 MB
    setuptools-82.0.1          |  py311haa95532_0         1.6 MB
    sqlite-3.51.2              |       hee5a0db_0         917 KB
    tk-8.6.15                  |       hf199647_0         3.5 MB
    tzdata-2026a               |       he532380_0         117 KB
    ucrt-10.0.22621.0          |       haa95532_0         620 KB
    vc-14.3                    |      h2df5915_10          19 KB
    vc14_runtime-14.44.35208   |      h4927774_10         825 KB
    vs2015_runtime-14.44.35208 |      ha6b5a95_10          19 KB
    wheel-0.46.3               |  py311haa95532_0          95 KB
    xz-5.8.2                   |       h53af0af_0         265 KB
    zlib-1.3.1                 |       h02ab6af_0         113 KB
    ------------------------------------------------------------
                                           Total:        36.4 MB

The following NEW packages will be INSTALLED:

  bzip2              pkgs/main/win-64::bzip2-1.0.8-h2bbff1b_6 
  ca-certificates    pkgs/main/win-64::ca-certificates-2026.3.19-haa95532_0 
  libexpat           pkgs/main/win-64::libexpat-2.7.5-hd7fb8db_0 
  libffi             pkgs/main/win-64::libffi-3.4.4-hd77b12b_1 
  libzlib            pkgs/main/win-64::libzlib-1.3.1-h02ab6af_0 
  openssl            pkgs/main/win-64::openssl-3.5.6-hbb43b14_0 
  packaging          pkgs/main/win-64::packaging-26.0-py311haa95532_0 
  pip                pkgs/main/noarch::pip-26.0.1-pyhc872135_1 
  python             pkgs/main/win-64::python-3.11.15-h1044e36_0 
  setuptools         pkgs/main/win-64::setuptools-82.0.1-py311haa95532_0 
  sqlite             pkgs/main/win-64::sqlite-3.51.2-hee5a0db_0 
  tk                 pkgs/main/win-64::tk-8.6.15-hf199647_0 
  tzdata             pkgs/main/noarch::tzdata-2026a-he532380_0 
  ucrt               pkgs/main/win-64::ucrt-10.0.22621.0-haa95532_0 
  vc                 pkgs/main/win-64::vc-14.3-h2df5915_10 
  vc14_runtime       pkgs/main/win-64::vc14_runtime-14.44.35208-h4927774_10 
  vs2015_runtime     pkgs/main/win-64::vs2015_runtime-14.44.35208-ha6b5a95_10 
  wheel              pkgs/main/win-64::wheel-0.46.3-py311haa95532_0 
  xz                 pkgs/main/win-64::xz-5.8.2-h53af0af_0 
  zlib               pkgs/main/win-64::zlib-1.3.1-h02ab6af_0 



Downloading and Extracting Packages:
                                                                                                                                                        
Preparing transaction: done                                                                                                                             
Verifying transaction: done                                                                                                                             
Executing transaction: done                                                                                                                             
#                                                                                                                                                       
# To activate this environment, use                                                                                                                     
#                                                                                                                                                       
#     $ conda activate ai311                                                                                                                            
#                     
# To deactivate an active environment, use
#
#     $ conda deactivate

Collecting fastapi==0.115.6 (from -r requirements.txt (line 1))
  Using cached fastapi-0.115.6-py3-none-any.whl.metadata (27 kB)
Collecting uvicorn==0.30.6 (from -r requirements.txt (line 2))
  Using cached uvicorn-0.30.6-py3-none-any.whl.metadata (6.6 kB)
Collecting langchain==0.3.7 (from -r requirements.txt (line 3))
  Using cached langchain-0.3.7-py3-none-any.whl.metadata (7.1 kB)
Collecting langchain-mistralai==0.2.6 (from -r requirements.txt (line 4))
  Using cached langchain_mistralai-0.2.6-py3-none-any.whl.metadata (2.5 kB)
Collecting python-dotenv==1.0.1 (from -r requirements.txt (line 5))
  Using cached python_dotenv-1.0.1-py3-none-any.whl.metadata (23 kB)
Collecting starlette<0.42.0,>=0.40.0 (from fastapi==0.115.6->-r requirements.txt (line 1))
  Using cached starlette-0.41.3-py3-none-any.whl.metadata (6.0 kB)
Collecting pydantic!=1.8,!=1.8.1,!=2.0.0,!=2.0.1,!=2.1.0,<3.0.0,>=1.7.4 (from fastapi==0.115.6->-r requirements.txt (line 1))
  Using cached pydantic-2.12.5-py3-none-any.whl.metadata (90 kB)
Collecting typing-extensions>=4.8.0 (from fastapi==0.115.6->-r requirements.txt (line 1))
  Using cached typing_extensions-4.15.0-py3-none-any.whl.metadata (3.3 kB)
Collecting click>=7.0 (from uvicorn==0.30.6->-r requirements.txt (line 2))
  Using cached click-8.3.2-py3-none-any.whl.metadata (2.6 kB)
Collecting h11>=0.8 (from uvicorn==0.30.6->-r requirements.txt (line 2))
  Using cached h11-0.16.0-py3-none-any.whl.metadata (8.3 kB)
Collecting PyYAML>=5.3 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached pyyaml-6.0.3-cp313-cp313-win_amd64.whl.metadata (2.4 kB)
Collecting SQLAlchemy<3,>=1.4 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached sqlalchemy-2.0.49-cp313-cp313-win_amd64.whl.metadata (9.8 kB)
Collecting aiohttp<4.0.0,>=3.8.3 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached aiohttp-3.13.5-cp313-cp313-win_amd64.whl.metadata (8.4 kB)
Collecting langchain-core<0.4.0,>=0.3.15 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached langchain_core-0.3.84-py3-none-any.whl.metadata (3.2 kB)
Collecting langchain-text-splitters<0.4.0,>=0.3.0 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached langchain_text_splitters-0.3.11-py3-none-any.whl.metadata (1.8 kB)
Collecting langsmith<0.2.0,>=0.1.17 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached langsmith-0.1.147-py3-none-any.whl.metadata (14 kB)
Collecting numpy<2.0.0,>=1.26.0 (from langchain==0.3.7->-r requirements.txt (line 3))
  Using cached numpy-1.26.4.tar.gz (15.8 MB)
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
  Installing backend dependencies ... done
  Preparing metadata (pyproject.toml) ... error
  error: subprocess-exited-with-error
  
  × Preparing metadata (pyproject.toml) did not run successfully.
  │ exit code: 1
  ╰─> [19 lines of output]
      + D:\genaiproject\backend\ai_service_py\.venv\Scripts\python.exe C:\Users\HP\AppData\Local\Temp\pip-install-15lcm9p0\numpy_86990fd2187243feb96934177665222f\vendored-meson\meson\meson.py setup C:\Users\HP\AppData\Local\Temp\pip-install-15lcm9p0\numpy_86990fd2187243feb96934177665222f C:\Users\HP\AppData\Local\Temp\pip-install-15lcm9p0\numpy_86990fd2187243feb96934177665222f\.mesonpy-j727u91e -Dbuildtype=release -Db_ndebug=if-release -Db_vscrt=md --native-file=C:\Users\HP\AppData\Local\Temp\pip-install-15lcm9p0\numpy_86990fd2187243feb96934177665222f\.mesonpy-j727u91e\meson-python-native-file.ini
      The Meson build system
      Version: 1.2.99
      Source dir: C:\Users\HP\AppData\Local\Temp\pip-install-15lcm9p0\numpy_86990fd2187243feb96934177665222f
      Build dir: C:\Users\HP\AppData\Local\Temp\pip-install-15lcm9p0\numpy_86990fd2187243feb96934177665222f\.mesonpy-j727u91e
      Build type: native build
      Project name: NumPy
      Project version: 1.26.4
      C compiler for the host machine: gcc (gcc 6.3.0 "gcc (MinGW.org GCC-6.3.0-1) 6.3.0")
      C linker for the host machine: gcc ld.bfd 2.28
      C++ compiler for the host machine: c++ (gcc 6.3.0 "c++ (MinGW.org GCC-6.3.0-1) 6.3.0")
      C++ linker for the host machine: c++ ld.bfd 2.28
      Cython compiler for the host machine: cython (cython 3.0.12)
      Host machine cpu family: x86
      Host machine cpu: x86
      
      ..\meson.build:28:4: ERROR: Problem encountered: NumPy requires GCC >= 8.4
      
      A full log can be found at C:\Users\HP\AppData\Local\Temp\pip-install-15lcm9p0\numpy_86990fd2187243feb96934177665222f\.mesonpy-j727u91e\meson-logs\meson-log.txt
      [end of output]
  
  note: This error originates from a subprocess, and is likely not a problem with pip.
error: metadata-generation-failed

× Encountered error while generating package metadata.
╰─> numpy

note: This is an issue with the package mentioned above, not pip.
hint: See above for details.
uvicorn : The term 'uvicorn' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or 
if a path was included, verify that the path is correct and try again.
At line:5 char:1
+ uvicorn main:app --host 0.0.0.0 --port 8001
+ ~~~~~~~
    + CategoryInfo          : ObjectNotFound: (uvicorn:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
 # Python AI Service

This service uses FastAPI + LangChain to generate structured interview reports and resume HTML.

## Setup

```powershell
cd D:\genaiproject\backend\ai_service_py
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run

```powershell
uvicorn main:app --host 0.0.0.0 --port 8001
```

## Environment

This service reads Mistral settings from `backend/.env`:

- `MISTRAL_API_KEY`
- `MISTRAL_MODEL` (optional)
