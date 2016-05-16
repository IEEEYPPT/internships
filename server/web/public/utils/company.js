/**
 * Created by user on 16/05/2016.
 */

function listCompanies() {
    //Table Header
    var header = "<thead><tr>";
    for (var i=0; i< companiesTable.length; i++)
        header += "<th class='text-center'>" + companiesTable[i].header + "</th>";
    header += "</tr></thead>";
    $('#listCompanies').append(header);

    //Table Content
    var body = "<tbody></tbody>";
    //TODO GET INFO FROM SERVER
    $('#listCompanies').append(body);
}