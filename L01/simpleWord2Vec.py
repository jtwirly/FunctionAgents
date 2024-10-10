import numpy as np
# Sigmoid function and its derivative
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    return x * (1 - x)

# Softmax function
def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / np.sum(e_x, axis=1, keepdims=True)

# RMS error function
def rms_error(y_true, y_pred):
    return np.sqrt(np.mean((y_true - y_pred) ** 2))
# Define the softmax function for the output layer

# Derivative of softmax for backpropagation
def softmax_derivative(softmax_output, y_true):
    return softmax_output - y_true

# One-hot encoding for the words
word_to_index = {'john': 0, 'abel': 1, 'is': 2, 'great': 3}
index_to_word = {index: word for word, index in word_to_index.items()}

# Training data
training_inputs = np.array([[1, 0, 0, 0],  # john
                            [0, 1, 0, 0],  # abel
                            [0, 0, 1, 0]])   # is

training_outputs = np.array([[0, 0, 1, 0],  # is
                             [0, 0, 1, 0],  # is
                             [0, 0, 0, 1]])  # great

# Initializing weights with random values
input_layer_neurons, hidden_layer_neurons, output_layer_neurons = 4, 2, 4
hidden_weights = np.random.uniform(size=(input_layer_neurons, hidden_layer_neurons))
output_weights = np.random.uniform(size=(hidden_layer_neurons, output_layer_neurons))

# Learning rate
lr = 0.05

# Training the network with RMS error
for epoch in range(20000):
    # Forward propagation
    hidden_layer_input = np.dot(training_inputs, hidden_weights)
    hidden_layer_output = sigmoid(hidden_layer_input)
    output_layer_input = np.dot(hidden_layer_output, output_weights)
    predicted_output = softmax(output_layer_input)

    # Backpropagation
    # The derivative of the cross-entropy loss function, when combined with a
    # softmax output layer, simplifies to the difference between the 
    # predicted probabilities and the actual values 
    
    error = rms_error(training_outputs, predicted_output)
    d_predicted_output = softmax_derivative(predicted_output, training_outputs)

    error_hidden_layer = d_predicted_output.dot(output_weights.T)
    d_hidden_layer = error_hidden_layer * sigmoid_derivative(hidden_layer_output)

    # Updating weights
    output_weights -= hidden_layer_output.T.dot(d_predicted_output) * lr
    hidden_weights -= training_inputs.T.dot(d_hidden_layer) * lr

# Displaying the weights between the input and hidden layer
# print out the hidden weights and the words they represent

print("Hidden Weights:")
for i, word in index_to_word.items():
    print(f"{word}: {hidden_weights[i, :]}")

# plot the hidden weights as vectors on a 2D plane

# Test words
test_words = ['john', 'abel', 'is']

# Initialize the input for testing
test_inputs = np.zeros((len(test_words), len(word_to_index)))
for i, word in enumerate(test_words):
    test_inputs[i, word_to_index[word]] = 1

# Forward propagation for testing
hidden_layer_input_test = np.dot(test_inputs, hidden_weights)
hidden_layer_output_test = sigmoid(hidden_layer_input_test)
output_layer_input_test = np.dot(hidden_layer_output_test, output_weights)
predicted_output_test = softmax(output_layer_input_test)

# Display the probabilities for the next word in each case
for i, word in enumerate(test_words):
    print(f"Probabilities for the next word after '{word}':")
    for j, prob in enumerate(predicted_output_test[i]):
        next_word = index_to_word[j]
        print(f"{next_word}: {prob}")

