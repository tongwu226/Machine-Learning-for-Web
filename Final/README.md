# Machine-Learning-for-Web Final Proposal 
### Inspiration from previous project: 

- I-ChingRead, [link](https://tongwu226.github.io/I-ChingRead/)
  - User's drawing as an input to generate I-ching reading results 



### Idea: 
I want to build a poetry writing experience with the help of machine learning. 
In this experience, 
- user's right hand will be detected as the pen tool, and they can draw freely on the canvas within a given time. 
- [Quick-draw dataset](https://github.com/googlecreativelab/quickdraw-dataset) then could uses the handwriting to try to describe what users are trying to draw. 
- Taking that guess as the keyword, it will return two most-relavent pictures from google search.
  And [im2txt](https://github.com/tensorflow/models/tree/master/research/im2txt) will be used to give the captions of returned images. 
- The two captions generated then will be mixed with texts generated based on the drawing into a four-sentence poetry. 

### Questions: 
- text to image? [link](tps://codeburst.io/understanding-attngan-text-to-image-convertor-a79f415a4e89)
