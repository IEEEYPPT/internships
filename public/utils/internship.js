/**
 * Created by user on 16/05/2016.
 */

function listInternships() {
    //Table Header
    var header = "<thead><tr>";
    for (var i=0; i< internshipsTable.length; i++)
        header += "<th class='text-center'>" + internshipsTable[i].header + "</th>";
    header += "</tr></thead>";
    $('#listInternships').append(header);

    //Table Content
    var body = "<tbody></tbody>";
    //TODO GET INFO FROM SERVER
    $('#listInternships').append(body);
}