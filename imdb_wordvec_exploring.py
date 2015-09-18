from gensim.models import word2vec
model = word2vec.Word2Vec.load("300features_40minwords_10context")

print model.most_similar("wongo")
