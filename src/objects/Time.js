import uuid from 'uuid/v4'
export default  class Time {
    
    constructor(title, begin, end, id) {

        if(typeof title == 'object') {
            var data = {
                title: title.title,
                begin: title.begin,
                end: title.end,
                id: title.id
            }
        }else {
            var data = {
                title: title,
                begin: begin,
                end: end,
                id: id
            }
        }

        if(typeof data.title == "undefined" || data.title == "") {
            this.title = "Untitled";
        }else {
            this.title = data.title;
        }
        
        if(typeof data.begin == "undefined") {
            this.begin = new Date().getTime();
        }else {
            this.begin = data.begin;
        }
        
        if(typeof data.end == "undefined") {
            this.end = null;
        }else {
            this.end = data.end;
        }
        
        if(typeof data.id == "undefined" || data.id == null) {
            this.id = uuid();
        }else {
            this.id = data.id;
        }
    }
}

