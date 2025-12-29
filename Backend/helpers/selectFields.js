const selectFields = (obj, fields) => {
    const result = {};
    fields.forEach(field => {
        if (obj[field] !== undefined) {
            result[field] = obj[field];
        }
    });
    return result;
} 



module.exports = selectFields;