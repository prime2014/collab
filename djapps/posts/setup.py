# from distutils.core import setup
from setuptools import setup
from Cython.Build import cythonize

setup(ext_modules=cythonize("/collab/djapps/posts/tasks.pyx"))

