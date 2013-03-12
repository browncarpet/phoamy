from threading import Thread
import comports
import serial, ConfigParser


config = ConfigParser.ConfigParser()
config.optionxform = str
config.read('config.txt')
lutronForwards = dict(config.items('lutron'))

class lutronRead(Thread):
	name = 'readHVACThread'
	def run(self):
		x = 1
		comBuffer = []	
		comQueue = []
		while x is 1 :
			#fromlutron = lutron.read()
			fromlutron = comports.com['lutron'].read()
			if fromlutron != '':
				#print fromhvac
				if '\r' not in fromlutron:
					comBuffer.append(fromlutron)
				else:
					try:
						x = 0
						comQueue.append(comBuffer)
						b = comQueue.pop()
						data = ''.join(b)
						if '\n' in data:
							data = data.replace('\n', '')
						print data
						if '~DEVICE' in data:
							try:
								if data in lutronForwards:
									comports.serialWrite(config.get('lutron', data))
							except:
								print 'Something is wrong'
								raise
						else:
							pass
					except:
						if lutronRead().isAlive():
							print 'thread still alive'
						else:
							print 'thread dead'
							lutronRead().start()
						raise
					finally:
						comBuffer = []
						x = 1

lutronRead().start()