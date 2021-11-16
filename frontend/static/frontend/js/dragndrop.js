'use strict';
(function(){
  // http://stackoverflow.com/questions/4083351/what-does-jquery-fn-mean
  var $ = function( elem ){
    if (!(this instanceof $)){
      return new $(elem);
    }
    this.el = document.getElementById( elem );
  };
  window.$ = $;
  $.prototype = {
    onChange : function( callback ){
      this.el.addEventListener('change', callback );
      return this;
    }
  };
})();

/**
// ||||||||||||||||||||||||||||||| \\
//  Drag and Drop code for Upload
// ||||||||||||||||||||||||||||||| \\
**/
var dragdrop = {
  init : function( elem ){
    elem.setAttribute('ondrop', 'dragdrop.drop(event)');
    elem.setAttribute('ondragover', 'dragdrop.drag(event)' );
  },
  drop : function(e){
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    runUpload( file );
  },
  drag : function(e){
    e.preventDefault();
  }
};


/**
// ||||||||||||||||||||||||||||||| \\
//  Code to capture a file (image) 
//  and upload it to the browser
// ||||||||||||||||||||||||||||||| \\
**/
function runUpload( file ) {
  // http://stackoverflow.com/questions/12570834/how-to-preview-image-get-file-size-image-height-and-width-before-upload
  if( file.type === 'image/png'  || 
      file.type === 'image/jpg'  || 
      file.type === 'image/jpeg' ||
      file.type === 'image/gif'  ||
      file.type === 'image/bmp'  ||
      file.type === 'video/mp4'  ){
    var reader = new FileReader(),
        image = new Image();
    reader.readAsDataURL( file );
    reader.onload = function( _file ){
      $('imgPrime').el.src = _file.target.result;
      $('imgPrime').el.style.display = 'inline';
    } // END reader.onload()
  } // END test if file.type === image
}

/**
// ||||||||||||||||||||||||||||||| \\
//  window.onload fun
// ||||||||||||||||||||||||||||||| \\
**/
window.onload = function(){
  if( window.FileReader ){
    // Connect the DIV surrounding the file upload to HTML5 drag and drop calls
    dragdrop.init( $('fileDropBox').el );
    //  Bind the input[type="file"] to the function runUpload()
    $('fileUpload').onChange(function(){ runUpload( this.files[0] ); });
  }else{
    // Report error message if FileReader is unavilable
    var p   = document.createElement( 'p' ),
        msg = document.createTextNode( 'Sorry, your browser does not support FileReader.' );
    p.className = 'error';
    p.appendChild( msg );
    $('fileDropBox').el.innerHTML = '';
    $('fileDropBox').el.appendChild( p );
  }
};

var loadFile = function(event) {
    var image = document.getElementById('imgPrime');
    image.src = URL.createObjectURL(event.target.files[0]);
};


const readImage = file => {
  if ( !(/^image\/(png|jpe?g|gif)$/).test(file.type) )
    return EL_preview.insertAdjacentHTML('beforeend', `<div>Unsupported format ${file.type}: ${file.name}</div>`);

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const img  = new Image();
    img.addEventListener('load', () => {
      EL_preview.appendChild(img);
      EL_preview.insertAdjacentHTML('beforeend', `<div>${file.name} ${img.width}×${img.height} ${file.type} ${Math.round(file.size/1024)}KB</div>`);
    });
    img.src = reader.result;
  });
  reader.readAsDataURL(file);  
};