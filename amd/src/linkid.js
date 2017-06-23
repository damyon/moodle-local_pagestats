// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Dynamically append info to clicked links so we have some info about which link in the page was clicked.
 * Useful for analysis of used/not used navigation links when there are duplicates on a page.
 *
 * @module     local_pagestats/linkid
 * @class      linkid
 * @package    local_pagestats
 * @copyright  2017 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['jquery'], function($) {

    return /** @alias module:local_pagestats/linkid */ {
        // Public variables and functions.
        /**
         * Add a link handler to all anchors in a page that will append a url param to any clicked links.
         *
         * @method init
         */
        init: function() {
            $('body').on('click', 'a[href]', function(e) {
                var done = $(e.currentTarget).data('frompageregion');
                if (!done) {
                    var sep = '&';
                    if (!e.currentTarget.hash) {
                        if (e.currentTarget.href.indexOf('?') === -1) {
                            sep = '?';
                        }
                        var region = 'unknown', hit;
                        if ($(e.target).closest('[role=main]').length) {
                            region = 'main';
                        }
                        hit = $(e.target).closest('[data-region]');
                        if (hit.length) {
                            region = 'region-' + hit.data('region');
                        }
                        hit = $(e.target).closest('[data-block]');
                        if (hit.length) {
                            region = 'block-' + hit.data('block');
                        }
                        if ($(e.target).closest('[role=banner]').length) {
                            region = 'banner';
                        }
                        if ($(e.target).closest('[role=navigation]').length) {
                            region = 'navigation';
                        }
                        e.currentTarget.search += sep + 'frompageregion=' + region;
                    }
                    $(e.currentTarget).data('frompageregion', true);
                }
                return true;
            });
        },

    };
});
