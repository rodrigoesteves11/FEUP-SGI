# SGI Json Reader

Library to read and parse a YAF file for SGI.

# Using the Parser

1. in a given class file MyWhateverNameClass.js in the constructor call:

```javascript
this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
this.reader.open("scenes/<path to json file>.json");	
```

The last argumet in the constructor is a method that is called when the json
file is loaded and parsed (see step 2).

2. in the MyWhateverNameClass.js class, add a method with signature: 

```javascript
onSceneLoaded(data) {
}
```

This method is called once the json file is loaded and parsed successfully. The
data argument is the entire scene data object. 

