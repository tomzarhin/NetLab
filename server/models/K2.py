import numpy as np
#import pyAgrum as gum


# Outputs graph edges to .gph file
def graph_out(dag, filename, mapping):
    with open(filename, 'w') as f:
        for i in range(np.size(dag[0])):
            for j in range(np.size(dag[0])):
                if (dag[i][j] == 1):
                    out_string = mapping[i] + ', ' + mapping[j] + '\n'
                    f.write(out_string)


# Creates a dictionary of node index to category strings
def map_categories(categories):
    mapping = {}
    for i in range(len(categories)):
        mapping[i] = categories[i][1:len(categories[i]) - 1]
    return mapping


# Given a target, find every instance index in array
def find(arr, target):
    array = np.array([], dtype='int64')
    for i in range(np.size(arr)):
        if (arr[i] == target):
            array = np.append(array, i)
    return array


# Ln gamma function ln((x-1)!) ->  ln(0) + ln(1) + ... + ln(x-1)
def ln_gamma(x):
    return sum(np.log(range(1, int(x))))


# Construct a data structure that stores the possible states (col) for each variable (row)
# Also returns a range vector that stores the number of states for each variable
def get_dim_range(_data, vec):
    count_n = 0
    d = np.size(vec[0, :])
    dim_length = np.zeros((1, d), dtype='int64')
    t = -1
    # Count number of states
    for q in range(d):
        temp_vec = np.unique(_data[:, vec[:, q]])
        x = temp_vec.reshape(1, np.size(temp_vec))
        temp_vec = x
        if (temp_vec[:, 0] == -1):
            temp_vec = np.empty()
        range_n = np.size(temp_vec)
        dim_length[0, q] = range_n
        t += 1
        # Assign zeros to the end to create valid matrix dimensions.
        if (count_n == 0):
            count_n = range_n
            dim = np.zeros((d, count_n), dtype='int64')
            dim[t, :] = temp_vec
        elif (count_n >= range_n):
            dim[t, :] = np.concatenate((temp_vec, np.zeros((1, count_n - range_n))), axis=1)
        elif (count_n < range_n):
            dim = np.concatenate((dim, np.zeros((d, range_n - count_n))))
            dim[t, :] = temp_vec
    return dim, dim_length


def score(blob, var, var_parents, data):
    score = 0
    n = blob.n_samples
    dim_var = blob.var_range_length[0, var]
    range_var = blob.var_range[var, :]
    r_i = dim_var
    data_o = blob.data
    used = np.zeros(n, dtype='int64')
    d = 1
    # Get first unproccessed sample
    while (d <= n):
        freq = np.zeros(int(dim_var), dtype='int64')
        while (d <= n and used[d - 1] == 1):
            d += 1;
        if (d > n):
            break
        for i in range(int(dim_var)):
            if (range_var[i] == data_o[d - 1, var]):
                break
        freq[i] = 1
        used[d - 1] = 1
        parent = data[d - 1, var_parents]
        d += 1
        if (d > n):
            break
        # count frequencies of states while keeping track of used samples
        for j in range(d - 1, n):
            if (used[j] == 0):
                if ((parent == data[j, var_parents]).all()):
                    i = 0
                    while range_var[i] != data[j, var]:
                        i += 1
                    freq[i] += 1
                    used[j] = 1
        sum_m = np.sum(freq)
        r_i = int(r_i)
        # Finally, sum over frequencies to get log likelihood bayesian score
        # with uniform priors
        for j in range(1, r_i + 1):
            if (freq[j - 1] != 0):
                score += ln_gamma(freq[j - 1] + 1)
        score += ln_gamma(r_i) - ln_gamma(sum_m + r_i)
    return score


# Data structure to hold samples and dimension state info.
class data_blob:
    def __init__(self, _data):
        self.var_number = np.size(_data[0, :])
        self.n_samples = np.size(_data[:, 0])
        self.data = _data
        (self.var_range, self.var_range_length) = get_dim_range(_data, np.arange(0, self.var_number).reshape(1,
                                                                                                             self.var_number))


# k2 uses scoring function to iteratively find best dag given a topological ordering
def k2(blob, order, constraint_u, data):
    dim = blob.var_number
    dag = np.zeros((dim, dim), dtype='int64')
    k2_score = np.zeros((1, dim), dtype='float')
    for i in range(1, dim):
        parent = np.zeros((dim, 1))
        ok = 1
        p_old = -1e10
        while (ok == 1 and np.sum(parent) <= constraint_u):
            local_max = -10e10
            local_node = 0
            # iterate through possible parent connections to determine best action
            for j in range(i - 1, -1, -1):
                if (parent[order[j]] == 0):
                    parent[order[j]] = 1
                    # score this node
                    local_score = score(blob, order[i], find(parent[:, 0], 1), data)
                    # determine local max
                    if (local_score > local_max):
                        local_max = local_score
                        local_node = order[j]
                    # mark parent processed
                    parent[order[j]] = 0
            # assign the highest parent
            p_new = local_max
            if (p_new > p_old):
                p_old = p_new
                parent[local_node] = 1
            else:
                ok = 0
        k2_score[0, order[i]] = p_old
        dag[:, order[i]] = parent.reshape(blob.var_number)
    return dag, k2_score


#def createCPT(data):
    #    bn = gum.BayesNet("Surviving Titanic")
    #bn = gum.fastBN(
    #    "Age{baby|toddler|kid|teen|adult|old}<-Survived{False|True}->Gender{Female|Male};Siblings{False|True}<-Survived->Parents{False|True}")
    #print(bn.variable("Survived"))
    #print(bn.variable("Age"))
    #print(bn.variable("Gender"))
    #print(bn.variable("Siblings"))
    #print(bn.variable("Parents"))
    #bn.cpt('Survived')[:] = [100, 1]
    #bn.cpt('Survived').normalizeAsCPT()
    #bn.cpt('Survived')
    #bn.cpt('Age')[0:] = [1, 1, 1, 10, 10, 1]
    #bn.cpt('Age')[1:] = [10, 10, 10, 1, 1, 10]
    #bn.cpt('Age').normalizeAsCPT()
    #bn.cpt('Age')
    #bn.cpt('Gender')[0:] = [1, 1]
    #bn.cpt('Gender')[1:] = [10, 1]
    #bn.cpt('Gender').normalizeAsCPT()
    #bn.cpt('Gender')
    #bn.cpt('Siblings')[0:] = [1, 10]
    #bn.cpt('Siblings')[1:] = [10, 1]
    #bn.cpt('Siblings').normalizeAsCPT()
    #bn.cpt('Siblings')
    #bn.cpt('Parents')[0:] = [1, 10]
    #bn.cpt('Parents')[1:] = [10, 1]
    #bn.cpt('Parents').normalizeAsCPT()
    #bn.cpt('Parents')
#return (None)

#def pretreat(df,userChoiceFunction):

    position=0

    #if 'Survived' in df.columns:
    #    df['Survived'] = df.apply(lambda row: userChoiceFunction[0](row, 'Survived'), axis=1).dropna()


    #for column in df.columns:
    #    df[column]=df.apply(userChoiceFunction[position],axis=1).dropna()
    #    position=position+1


    #df['SibSp'] = df.apply(lambda row: forBoolean(row, 'SibSp'), axis=1).dropna()
    #df['Parch'] = df.apply(lambda row: forBoolean(row, 'Parch'), axis=1).dropna()
    #df['Sex'] = df.apply(forGender, axis=1).dropna()
    #droped_cols = [col for col in ['PassengerId', 'Name', 'Ticket', 'Fare', 'Cabin'] if col in df.columns]
    #df = df.drop(droped_cols, axis=1)
    #df = df.rename(index=str, columns={'Sex': 'Gender', 'SibSp': 'Siblings', 'Parch': 'Parents'})
    #return df


#traindf = pandas.read_csv(os.path.join('res', 'titanic', 'train.csv'))
#testdf = pandas.merge(pandas.read_csv(os.path.join('res', 'titanic', 'test.csv')),
#                      pandas.read_csv(os.path.join('res', 'titanic', 'gender_submission.csv')),
#                      on="PassengerId")
#traindf = pretreat(traindf)
#testdf = pretreat(testdf)
