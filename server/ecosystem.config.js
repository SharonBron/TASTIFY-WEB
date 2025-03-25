module.exports = {
    apps : [{
      name   : "tastify",
      script : "./dist/src/index.js",
      env_production : {
        NODE_ENV: "production",
        PORT: "443"
      }
    }]
  
  }