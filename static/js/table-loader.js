$(document).ready(function(){
    $('div[csvurl]').each(function() {
        let div = $(this);
        new TableLoader(div).loadTable();
    });
});

class TableLoader {

    constructor(div) {
        this.root = div;
        this._checkboxes = true;
        this.tr = null; // DOM current row
        this.td = null; // DOM current cell/td
        this.table = null;  // DOM table
        this.rows = 0; // count of rows added, including headers
    }

    set checkboxes(enabled) {
        this._checkboxes = enabled;
        this.tr.empty();
    }

    reloadTable(id) {
        this.root = $('#' + id);
        loadTable();
    }

    loadTable() {
        let div = this.root;
        let csvurl = div.attr('csvurl');
        let title = div.attr('title');
        let id = div.prop('id');

        // clear out the old and add a spinner
        this.addSpinner(div);

        const proxyUrl = "https://u8tv9seds6.execute-api.us-west-2.amazonaws.com/prod/cors-proxy";
        const url = proxyUrl + '?url=' + encodeURIComponent(csvurl);
        $.get( url, csv => {
            this.removeSpinner(div);
            this.table = $('<table class="csv-table">').appendTo(div);
            this.craftTable(csv);
        }).fail( err => {
            this.removeSpinner(div);
            let html = '<div class="refresh-message" onclick="reloadTable(\'' + id + '\')">Problem loading table... refresh?</div>';
            div.append(html);
        });
    }

    addSpinner(div) {
        div.empty();
        div.css('background-image','url(/images/spinner.gif)');
        div.css('background-size','cover');
        div.css('width','64px');
        div.css('height','64px');
    }

    removeSpinner(div) {
        div.css('background-image','none');
        div.css('background-size','auto');
        div.css('width','auto');
        div.css('height','auto');
    }

    craftTable(csv) {
        let lines = Papa.parse(csv).data;
        if( !lines )
            this.table.text('TBD');
        else
            lines.forEach( cells => {
                this.addRow(cells);
            }); 
    }

    hasRowValues() {
        let size = 0;
        this.tr.find('td').each( (index,td) => {
            if( td.innerHTML ) {
                size += td.innerHTML.trim().length;
            }
        });

        return size > 0;
    }

    addRow(cells) {
        if( !cells )
            return;
        this.tr = $('<tr>');
        this._colspan = 1; // default value       
        cells.forEach( value => {
            this.addCell(value);
        });

        if( this.hasRowValues() == false )
            return;

        // has checkboxes
        if( this._checkboxes ) {
            this.tr.prepend( this.rows === 0 || this._skipcheckbox ? $('<td>') : $('<td>').html('<input type="checkbox"/>') );
            this._skipcheckbox = null;
        }

        this.table.append( this.tr );
        this.rows++;
    }

    executeScript(js) {
        console.log( 'Executing', js );
        let result = Function('"use strict";return (function(builder){' + js + '})')()(this);
    }

    colspan(n) {
        this.td.attr('colspan',n);
        this._colspan = n;   // skip the next N cells
    }

    skipcheckbox() {
        this._skipcheckbox = true;
    }

    addCell(value) {
        if( this._colspan > 1 ) {
            this._colspan--;
            return;
        }

        const regex = /\[(.*)\]\((.*)\)/;
        this.td = $('<td>');

        // javascript?
        let trimmed = value.trim();
        let p = trimmed.indexOf('${');
        if( p > -1 && trimmed.charAt(trimmed.length-1) == '}' ) {
            let js = value.substring(p+2,trimmed.length-1);
            this.executeScript(js);

            value = trimmed.substring(0,p); // continue on with value before javascript
        }

        // markdown?
        var matches = value.match(regex);
        if( matches && matches.length == 3 ) {
            this.td.append( $("<a>", {
                target : "_vendor",
                text : matches[1],
                href : matches[2]
            }) );
        } else
            this.td.text(value);

        this.tr.append( this.td );
    }
}