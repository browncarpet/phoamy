#!/usr/bin/python
###############################################################################
##
##
##
###############################################################################

import sys, serial, threading, time, os
import lutron, comports, audioauthority
from threading import Thread
from twisted.internet import reactor
from twisted.python import log
from twisted.web.server import Site
from twisted.web.static import File

from autobahn.websocket import WebSocketServerFactory, \
                               WebSocketServerProtocol, \
                               listenWS

	
			
class BroadcastServerProtocol(WebSocketServerProtocol):

	def onOpen(self):
		self.factory.register(self)

	def onMessage(self, msg, binary):
		if not binary:
			global msgList
			#self.factory.broadcast("'%s' from %s" % (msg, self.peerstr))
			self.factory.broadcast(msg)
			command = msg
			print command
			if 'comstar|hvac' in command:
				command = command.split('|')[1]
				comports.serialWrite('comstar|'+hvacRCS.webToRCS(command))
			elif 'audioa|getStatus' in command:
				audioauthority.makeCommand(command.split('.')[1], bracket=')')
			else:
				comports.serialWrite(command)
			command = ''

	def connectionLost(self, reason):
		WebSocketServerProtocol.connectionLost(self, reason)
		self.factory.unregister(self)


class BroadcastServerFactory(WebSocketServerFactory):
	"""
	Simple broadcast server broadcasting any message it receives to all
	currently connected clients.
	"""

	def __init__(self, url, debug = False, debugCodePaths = False):
		WebSocketServerFactory.__init__(self, url, debug = debug, debugCodePaths = debugCodePaths)
		self.clients = []
		self.tickcount = 0
		self.tick()

	def tick(self):
		self.tickcount += 1
		self.broadcast("'tick %d' from server" % self.tickcount)
		reactor.callLater(10, self.tick)

	def register(self, client):
		if not client in self.clients:
			#hvac.write('##%a507A=1,R=1\r')
			print "registered client " + client.peerstr
			self.clients.append(client)
			#hvacRefresh()
			
	def unregister(self, client):
		if client in self.clients:
			print "unregistered client " + client.peerstr
			self.clients.remove(client)

	def broadcast(self, msg):
		print "broadcasting message '%s' .." % msg
		for c in self.clients:
			c.sendMessage(msg)
			print "message sent to " + c.peerstr



class BroadcastPreparedServerFactory(BroadcastServerFactory):
	"""
	Functionally same as above, but optimized broadcast using
	prepareMessage and sendPreparedMessage.
	"""

	def broadcast(self, msg):
		print "broadcasting prepared message '%s' .." % msg
		preparedMsg = self.prepareMessage(msg)
		for c in self.clients:
			c.sendPreparedMessage(preparedMsg)
			print "prepared message sent to " + c.peerstr


#hvacPoller(refresh).start()	 
		 
if __name__ == '__main__':

	if len(sys.argv) > 1 and sys.argv[1] == 'debug':
		log.startLogging(sys.stdout)
		debug = True
	else:
		debug = False

	ServerFactory = BroadcastServerFactory
	#ServerFactory = BroadcastPreparedServerFactory

	factory = ServerFactory("ws://0.0.0.0:9000",
												 debug = debug,
												 debugCodePaths = debug)

	factory.protocol = BroadcastServerProtocol
	factory.setProtocolOptions(allowHixie76 = True)
	listenWS(factory)

	webdir = File(os.getcwd())
	web = Site(webdir)
	reactor.listenTCP(8081, web)

	reactor.run()