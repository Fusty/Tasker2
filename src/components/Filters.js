import moment from 'moment'

var dateFilter = function(value, format){
    if(typeof format == "undefined") {
        format = "YYYY-MM-DD hh:mm";
    }
    return moment.unix(value/1000).format(format);
}

var truncateFilter = function(value, length, append){
    if(value.length < length) {
        return value.trim();
    }else {
        if(typeof append == "undefined")
            append = "";
        // Find first index of whitespace before length limit
        var negativeIndex = value.substring(0,length).split("").reverse().join("").search(/\s/);
        var index = value.substring(0,length).length - (negativeIndex > 0 ? negativeIndex : 0);
        return value.substring(0,length).substring(0, index).trim() + append;
    }
}

export {dateFilter, truncateFilter}

export default {}