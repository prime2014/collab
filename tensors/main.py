from keras.utils import np_utils
from keras.datasets import cifar10
from keras.layers import Dense, Activation
from keras.models import Sequential
from keras.optimizers.adam import Adam
import numpy as np
from typing import Union, List


model = Sequential()
model.add(Dense(20, input=np.array([2, 3, 4, 5], dtype=np.float64)))
model.add(Activation("relu"))
model.compile()


def image_detection():
    pass
