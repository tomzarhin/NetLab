import collections
import numpy as np
from pgmpy.models import BayesianModel
import pandas

def log_gamma(x):
    '''
    returns the log of gamma for integers
    '''
    return sum(np.log(range(1,x+1)))

def score_function(M_cache):
    '''
    M is a dictionary with (i,j,k) as the key
    i: node
    j: Parents instantiation - tuple
    k: Value of the node
    sum_M is a dictionary of sums of M
    Returns a score value
    '''
    (M, sum_M, sum_alp) = M_cache
    score = 0
    for key in M.keys():
        score += log_gamma(1 + M[key]) #- log_gamma(alp[key])
    for key in sum_alp.keys():
        score +=  - log_gamma(sum_alp[key] + sum_M[key]) + log_gamma(sum_alp[key])
    return score

def Graph_to_M(D,parents,states):
    '''
    D is the data set in numpy.matrix format
    states[i] list of the values node i can take
    parents[i] list of the parents of node[i]
    returns dictionary (M, sum_M, alp, sum_alp)
    '''
    (rows,cols) = D.shape

    M = collections.defaultdict(int)
    sum_alp = collections.defaultdict(int)
    sum_M = collections.defaultdict(int)

    for row_i in range(rows):
        for col_j in range(cols):
            val = D[row_i,col_j]
            par = parents[col_j]
            par_vals = D[row_i,par]
            ##figuring out the parent instantiation.
            M[col_j,tuple(par_vals) ,val] += 1
            sum_M[col_j,tuple(par_vals)] += 1
    ##Get Alpha && sum_alpha values
    for key in sum_M.keys():
        sum_alp[key] = len(states[key[0]])
    return (M, sum_M, sum_alp)

def GraphUpdate(G,D,topologicalOrder,parents,states,numberOfParents):
    '''
    G : Graph
    D : Datasets
    topologicalOrder defining the parents order
    parents: dictionary containing the parents of each node
    states: possible values each node can take
    Use K2 algorithm + monte carlo method to compute a good possible update
    Also check if the updated graph has a cycle or not
    returns an updated (graph, score)
    '''
    ##Run a K2 search

    count = 0
    n = G.shape[0] ##Number of Elements
    ##Create a list of size n, for testing out the neighbouring graphs
    random_list = [] ##This should be SORTED (so that its basically upper triangular!!!!!!!
    M_cache = Graph_to_M(D,parents,states)
    #print "The M_cache at this point is:",M_cache
    score = score_function(M_cache)
    #print "Shape of D is:", D.shape
    print("The score at the BEGINNING is:", score)
    edges_allowed = np.array(range(n) )* 0.5
    added_FLAG = False
    for ele in range(n):
        ##for each tuple in the random list
        parents_counter = 0
        node = topologicalOrder[ele]
        max_edges = edges_allowed[ele]
        added_FLAG = False
        for par_ele in range(0,ele):
            par = topologicalOrder[par_ele]
            print("\n considering the edge:", (par,node))
            if (par not in parents[node] and parents_counter < max_edges and len(parents[node])<numberOfParents):
                G[par,node] = 1
                parents[node] += [par]
                #print "parents are:",parents
                M_cache = Graph_to_M(D,parents,states)
                score_temp = score_function(M_cache)
                if score_temp > score:
                    score = score_temp
                    print("added the Edge ", (par,node))
                    parents_counter += 1
                    print("the score is UPDATED:", score_temp)
                    added_FLAG = True
                else:
                    print("NOT adding the Edge ", (par,node))
                    G[par,node] = 0##Go back to the graph
                    parents[node].pop()##remove the node from the parents dictionary
    return(G,parents,score)

def PruneGraphUpdate(G,D,topologicalOrder,parents,states):
    '''
    Prunes the graph G and returns a sparser graph that is still better
    G: Adjacency matrix of Graph
    D: Dataset
    topologicalOrder : Ordering of the nodes
    parents: dictionary with values as the List of parents,
             and keys as nodes
    states: dictionary with values as the list of possible values
            and keys as the node
    returns G,UpdateParents,score
    '''
    M_cache = Graph_to_M(D,parents,states)
    score = score_function(M_cache)
    for (key,values) in parents.items():
        for val in values:
            G[val,key] = 0
            parents[key].remove(val)
            M_cache = Graph_to_M(D,parents,states)
            score_temp = score_function(M_cache)

            if score_temp > score:
                #do nothing
                print("Pruned the edge", (val,key))
                pass
            else:#restore to the last state

                G[val,key] = 1
                parents[key] += [val]

    return (G,parents,score)

def bayesianNetworkK2AndTables(dataset,categories,numberOfParents,dontKnowTheArrangement):
    data = list(list(int(a) for a in b if a.isdigit()) for b in dataset)
    data = np.array(data)
    # dataset = np.delete(dataset, 0, 1)
    categories = np.array(categories)

    (m, n) = data.shape
    num_steps = 10
    num_iter = 20
    score_arr = []
    scor_cache = {}
    states = collections.defaultdict(list)

    for i in range(n):
        states[i] = list(np.unique(data[:, i]))

    for iter in range(num_iter):

        G = np.zeros([n, n])
        if(dontKnowTheArrangement=='block'):
            topologicalOrder = list(np.random.choice(n, n, replace=False))
        else:
            topologicalOrder = list(np.arange(n))

        parents = collections.defaultdict(list)

        ##Get the unique elements in the columns

        count = 0
        opt_score = -10e10
        opt_parents = None
        old_score = 1e10

        while (count < num_steps):

            (G, parents, score) = GraphUpdate(G, data, topologicalOrder, parents, states,numberOfParents)
            (G, parents, score) = PruneGraphUpdate(G, data, topologicalOrder, parents, states)

            if opt_score < score:
                opt_score = score
                opt_parents = parents

            if (abs((old_score - score) / score)) <= 0.000001:  #Stopping criteria
                count += num_steps
            old_score = score
            count += 1
        final_M_cache = Graph_to_M(data, parents, states)
        final_score = score_function(final_M_cache)
        score_arr += [final_score]
        scor_cache[iter] = parents
        if(dontKnowTheArrangement!='block'):
            break

    best_score = np.argmax(score_arr)
    parents = scor_cache[best_score]
    graph_list=[]
    dag = np.zeros((n, n), dtype='int64')
    for (key, values) in parents.items():
        for val in values:
            graph_list.append(categories[val] + "," + categories[key])
            dag[val,key]=1

    graph_list=list(graph_list)
    return(graph_list,dag,data)

def createBayesGraph(graph_list,mapping,data):
# Creating bayesian network graph function
# Author: Tom Zarhin
    cpds_array = []
    categories_each_element = {}  # Returning an array with the values of each element
    bayes_model = BayesianModel()
    bayes_model.add_nodes_from(list(mapping))
    for value in graph_list:
        temp_list=value.split(',')
        bayes_model.add_edge(temp_list[0],temp_list[1])
    data_dict = {mapping[i]: data[:,i] for i in range(0, len(mapping))}
    data_dict_pd = pandas.DataFrame(data=data_dict)
    bayes_model.fit(data_dict_pd)

    cpds_tables = bayes_model.get_cpds()

    # Creating the array which returs to the client
    for cpd in cpds_tables:
        cpds_list = {}
        for cat in cpd.state_names:
            categories_each_element[cat] = cpd.state_names[cat]
        cpd_string = str(cpd).split('|')
        temp_array = []
        cpd_matrix_values = []
        digits_numbers = False

        for a in cpd_string:
            if (is_number(a)):
                temp_array.append(float(a.strip()))
                digits_numbers = True
            elif ("-+" in a and digits_numbers == True):
                cpd_matrix_values.append(temp_array)
                temp_array = []
                digits_numbers = False
        cpds_list[str(list(cpd.variables))] = cpd_matrix_values
        cpds_array.append(cpds_list)
    return(bayes_model,cpds_array,categories_each_element)

def is_number(s):
    # Getting a character and returning if it is a number
    # Author: Tom Zarhin
    try:
        float(s)
        return True
    except ValueError:
        return False
