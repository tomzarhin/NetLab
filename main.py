"""
__author__ = "Tom Zarhin", "Or Edri"
__copyright__ = "Copyright 2019, The Netlab Project"
__credits__ = "Anat Dahan"
__license__ = "GPL"
__version__ = "1.0.0"
__maintainer__ = "Tom Zarhin"
__email__ = "Tom Zarhin@s.braude.ac.il"
__status__ = "Production"
"""
from tkinter import *
from server.models.NetlabServer import NetlabServer

def number_constraint(digit):
    """
    Is digit a number or not
    :param digit: some string
    :return: ok for number
    """
    v = str(digit)
    try:
        v = int(v)
    except ValueError:
        if v != "\x08" and v != "":
            return "break"
    return "ok"

def initialclicked():
    """
    listener for clicking the start server button
    :return:
    """
    if(number_constraint(txt.get())=="break"):
        return
    first_label.configure(text="Running on http://127.0.0.1:" + txt.get() + "/")
    secound_label.configure(text="Server is ongoing...")
    initial_btn.config(state=DISABLED)
    close_btn.config(state="normal")
    global routers
    routers = NetlabServer(txt.get())
    routers.run_server()

def closeClicked():
    """
    listener for closing the connection of the server
    :return:
    """
    first_label.configure(text="Please choose port to run localhost")
    secound_label.configure(text="Server not active...")
    initial_btn.config(state="normal")
    close_btn.config(state=DISABLED)
    routers.terminate_server()

if __name__ == '__main__':
    window = Tk()
    window.title("Welcome to Netlab")
    window.geometry('200x120')
    first_label = Label(window, text="Please choose port to run localhost")
    first_label.grid(column=0, row=1)
    txt = Entry(window, width=10)
    txt.insert(END, '1000')
    txt.grid(column=0, row=2)
    initial_btn = Button(window, text="Initialize", command=initialclicked)
    close_btn = Button(window, text="Close Connection", command=closeClicked)
    close_btn.config(state=DISABLED)
    initial_btn.grid(column=0, row=3)
    close_btn.grid(column=0, row=4)
    secound_label = Label(window, text="Server not active...")
    secound_label.grid(column=0, row=5)
    window.mainloop()