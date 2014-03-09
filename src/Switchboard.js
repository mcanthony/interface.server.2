var _ = require( 'lodash' ), EE = require( 'events' ).EventEmitter, IS2
Switch = module.exports = {
  
  init: function( app ) {
    IS2 = app
    
    Object.defineProperties( IS2, { // for routing purposes
      applications : {
        get: function() { return IS2.applicationManager.applications },
        set: function(v) { IS2.applicationManager.applications = v }
      }
    })
    
    this.__proto__ = new EE()
    return this
  },
  
  route : function() {
    var args = Array.prototype.slice.call( arguments, 0 ),
        msg  = args[ 0 ],
        msgArgs = args.slice( 1 ),
        components = msg.split( '/' ).slice( 2 ), // first should be empty, second is 'interface'
        output = null // return null if this is not a getter call
    
    console.log( components )
    var i = 1, processing = IS2[ components[0] ], tProcessing = 'object', found = null, lastObject = null
    while( i < components.length && tProcessing === 'object' ) {
      lastObject = processing
      processing = processing[ components[ i ] ]
      tProcessing = typeof processing
      i++
    }
    if( typeof processing === 'function' ) {
      if( msgArgs.length ) {
        processing.apply( lastObject, msgArgs )
      }else{
        output = processing()
      }
    }else{
      if( msgArgs.length ) {
        lastObject[ components[ i - 1] ] = msgArgs[ 0 ]
      }else{
        output = lastObject[ components[ i - 1] ]
      }
    }
    
    return output
  },
  
  '/interface/createApplicationWithText': function( text ) {
    IS2.applicationManager.createIS2licationWithText( text )
  },
  
  '/interface/removeApplicationWithName': function( name ) {
    IS2.applicationManager.removeIS2licationWithName( name )
  },
  // TODO: should be: /interface/test/blah/setMin 100
  '/interface/changeInputPropertyForApplication': function( applicationName, inputName, propertyName, newValue ) {
    var app = IS2.applicationManager.applications[ applicationName ],
        input = app.inputs[ inputName ]
        
    input[ propertyName ] = newValue
    console.log( propertyName, input[ propertyName ] )
  },
}

// /interface/applications/blah/min 100