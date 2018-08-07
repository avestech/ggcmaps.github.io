var debug = {
    active: true,
    group: function(name) {
        if (this.active) {
            console.group(name);
        }
    },
    end: function() {
        console.groupEnd();
    },
    msg: function(msg) {
        if (this.active) {
            console.log(msg);
        }
    },
    error: function(msg) {
        if (this.active) {
            console.error(msg);
        }
    }
};
