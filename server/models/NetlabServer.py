from multiprocessing import Process
from Routers import applicationStart

class NetlabServer:
  def __init__(self, port):
    self.port = port
    self.server = Process(target=applicationStart,args=(port,))

  def run_server(self):
    """
    running the server on localhost
    :param port: the input port from the user
    :return:
    """
    self.server.start()

  def terminate_server(self):
    self.server.terminate()