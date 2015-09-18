
# coding: utf-8

# In[1]:

import pandas as pd
train_data = pd.read_csv("labeledTrainData.tsv", header=0, delimiter="\t", quoting=3)
test_data = pd.read_csv("testData.tsv", header=0, delimiter="\t", quoting=3)
unlabeled_train_data = pd.read_csv("unlabeledTrainData.tsv", header=0, delimiter="\t", quoting=3)

print "Read %d labeled train reviews, %d labeled test reviews, "  "and %d unlabeled reviews\n" % (train_data["review"].size,  
 test_data["review"].size, unlabeled_train_data["review"].size )


# In[2]:

from bs4 import BeautifulSoup
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

wordnet_lemmatizer = WordNetLemmatizer()

def review_to_wordlist(raw_review, remove_stopwords=False):
    review_text = BeautifulSoup(raw_review, "html.parser").get_text()
    
    letters_only = re.sub("[^a-zA-Z]", " ", review_text)
    
    words = letters_only.lower().split()
    
    if remove_stopwords:
        stops = set(stopwords.words("english"))
        words = [w for w in words if not w in stops]
    
    lemmaed_words = [wordnet_lemmatizer.lemmatize(w) for w in words]
    
    return(lemmaed_words)


# In[9]:

import nltk.data

tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')


# In[49]:

def review_to_sentences(review, tokenizer, remove_stopwords=False):    
    fixed_review = re.sub('´', '\'', review)
    
    try:
        raw_sentences = tokenizer.tokenize(fixed_review.strip())
    except UnicodeDecodeError:
        return []
    
    sentences = []
    for raw_sentence in raw_sentences:
        if len(raw_sentence) > 0:
            sentences.append(review_to_wordlist(raw_sentence, remove_stopwords))
    return sentences


# In[64]:

sentences = []

print "Parsing sentences from training set"

for i, review in enumerate(train_data["review"]):
    if i % 1000 == 0:
        print i
    sentences += review_to_sentences(review, tokenizer, True)
    
print "Parsing sentences from test set"

for i, review in enumerate(test_data["review"]):
    if i % 1000 == 0:
        print i
    sentences += review_to_sentences(review, tokenizer, True)
    
print "Parsing sentences from unlabeled set"

for i, review in enumerate(unlabeled_train_data["review"]):
    if i % 1000 == 0:
        print i
    sentences += review_to_sentences(review, tokenizer, True)

print "Done!"


# In[56]:

print "length of vocab is:", len(sentences)

import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
num_features = 300
min_word_count = 40
num_workers = 8
context = 10
downsampling = 1e-3

from gensim.models import word2vec
print "Training model..."

model = word2vec.Word2Vec(sentences,
                          workers=num_workers, 
                          size=num_features,
                          min_count=min_word_count,
                          window=context, 
                          sample=downsampling)

print "Done training model!"

model.init_sims(replace=True)

model_name = "300features_40minwords_10context"
model.save(model_name)

