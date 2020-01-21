import pymongo
class Mongo:
    def __init__(self):
        client = pymongo.MongoClient("mongodb+srv://admin:admin@netlab-keluq.azure.mongodb.net/netlabdb?retryWrites=true&w=majority")
        self.db = client.netlabdb

    def getExperiments(self,userName):
        experiment_array=[]
        experiments=self.db.experiments.find({"userName": userName})
        for exp in experiments:
            #exp.pop('_id')
            experiment_array.append(exp)
        return experiment_array

    def getTask(self,idExp):
        tasks_array=[]
        tasks=self.db.tasks.find({"idExp": idExp})
        for task in tasks:
            task.pop('_id')
            tasks_array.append(task)
        return tasks_array

    def login(self,inputEmail,password):
        for user in self.db.users.find({"_id":inputEmail, "userPassword":password}):#, "status":"Disconnected"}):
            experiment_array = []
            experiments = self.db.experiments.find({"userName": inputEmail})
            for exp in experiments:
                experiment_array.append(exp)
            return(experiment_array,user["userFullName"])
        return(None)

    def createExperiment(self,description,userName,name):
        nextId = self.db.experiments.find_one(sort=[("_id", pymongo.DESCENDING)])
        if (nextId == None):
            nextId = 1
        else:
            nextId = int(nextId.pop('_id')) + 1
        self.db.experiments.insert_one({
            u'_id':nextId,
            u'experimentName': u'' + name + '',
            u'experimentDescription': u'' + description + '',
            u'userName': u'' + userName + '',
            u'tasks': []
        })
        return nextId

    def createTask(self,dataset,datasetcols,name,description,current_experiment_id):
        nextId = self.db.experiments.find_one({"_id": current_experiment_id})
        if (len(nextId["tasks"]) == 0):
            nextId = 1
        else:
            nextId = int(nextId["tasks"][-1].pop('task_id')) + 1
        myquery = {"_id": current_experiment_id}
        newvalues = {"$push": {
            "tasks": {"task_id": nextId, "taskName": name, "taskDescription": description, "datasetcols": datasetcols,
                      "dataset": dataset}}}
        self.db.experiments.update_one(myquery, newvalues)
        return(nextId)

    def register(self,inputEmail,password,userFullName):
        try:
            #self.db.users.createIndex({"userName": 1}, {unique: true})
            self.db.users.insert({
                u'_id': u'' + inputEmail + '',
                u'userPassword': u'' + password + '',
                u'userFullName': u'' + userFullName + ''
            })
            return({"status":"registered"})
        except:
            print("error")
            return({"error":"User already exist"})

    def deleteTask(self, idTask, idExp):
        myquery = {"_id": idExp}
        newvalues = {"$pull": {"tasks": {"task_id":idTask}}}
        #self.db.experiments.update({},{ $pull: {tasks: { $ in: ["apples", "oranges"]}}},{multi: true})
        value=self.db.experiments.update(myquery, newvalues)
        print(value)