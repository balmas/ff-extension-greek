/**
 * @fileoverview Greek specific string conversion methods 
 * Exports a single symbol, ConvertGreek which must be imported into the namespace 
 * of the importing class.
 *
 * @version $Id$
 *   
 * Copyright 2008-2009 Cantus Foundation
 * http://alpheios.net
 * 
 * This file is part of Alpheios.
 * 
 * Alpheios is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Alpheios is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
const EXPORTED_SYMBOLS = ['ConvertGreek'];
Components.utils.import("resource://alpheios/alpheios-browser-utils.jsm");
Components.utils.import("resource://alpheios/alpheios-convert.jsm");

/**
 * @class Greek string conversion class
 * @extends Convert
 */
ConvertGreek = function()
{
    Convert.call(this);
}

ConvertGreek.prototype = new Convert();

/**
 * greek ascii transliteration (unicode to betacode)
 * @param {String} a_str the string to convert
 * @returns the converted string
 * @type {String}
 */
ConvertGreek.prototype.greekToAscii = function(a_str)
{
    // module code doesn't have access to the browser window object under the global 
    // scope .. need to get a recent window to have access to browser window methods
     var recent_win = BrowserUtils.getMostRecentWindow();
    /* initialize the XSLT converter if we haven't done so already */
    if (this.u2bConverter == null)
    {
        this.d_u2bConverter = BrowserUtils.getXsltProcessor('alpheios-uni2betacode.xsl');
    }
    var betaText = '';
    try
    {
        this.d_u2bConverter.setParameter(null, "e_in", a_str);
        var dummy = (new recent_win.DOMParser()).parseFromString("<root/>","text/xml");
        betaText = this.d_u2bConverter.transformToDocument(dummy).documentElement.textContent;
    }
    catch (e)
    {
        this.s_logger.error(e);
    }
    return betaText;
}

/**
 * greek normalization (precomposed/decomposed Unicode)
 * @param {String} a_str the string to normalize
 * @param {Boolean} a_precomposed whether to output precomposed Unicode
 *   (default = true)
 * @param {String} a_strip characters/attributes to remove
 *   (specified as betacode characters - e.g. "/\\=" to remove accents)
 *   (default = no stripping)
 * @param {Boolean} a_partial whether this is partial word
 *   (if true, ending sigma is treated as medial not final)
 *   (default = false)
 * @returns the normalized string
 * @type {String}
 */
ConvertGreek.prototype.normalizeGreek = function(a_str, a_precomposed, a_strip, a_partial)
{
    // module code doesn't have access to the browser window object under the global 
    // scope .. need to get a recent window to have access to browser window methods
    var recent_win = BrowserUtils.getMostRecentWindow();
    /* initialize the XSLT converter if we haven't done so already */
    if (this.d_uNormalizer == null)
    {
        this.d_uNormalizer = BrowserUtils.getXsltProcessor('alpheios-normalize-greek.xsl');
    }

    // set defaults for missing params
    if (typeof a_precomposed == "undefined")
        a_precomposed = true;
    if (typeof a_strip == "undefined")
        a_strip = "";
    if (typeof a_partial == "undefined")
        a_partial = false;

    var normText = '';
    try
    {
        this.d_uNormalizer.setParameter(null, "e_in", a_str);
        this.d_uNormalizer.setParameter(null,
                                        "e_precomposed",
                                        (a_precomposed ? 1 : 0));
        this.d_uNormalizer.setParameter(null, "e_strip", a_strip);
        this.d_uNormalizer.setParameter(null,
                                        "e_partial",
                                        (a_partial ? 1 : 0));
        var dummy = (new recent_win.DOMParser()).parseFromString("<root/>","text/xml");
        normText = this.d_uNormalizer.transformToDocument(dummy).documentElement.textContent;
    }
    catch (e)
    {
        this.s_logger.error(e);
    }
    return normText;
}

