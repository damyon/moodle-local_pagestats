<?php
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
 * Callbacks file for local_pagestats plugin
 *
 * @package    local_pagestats
 * @copyright  2017 Damyon Wiese  <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

function local_pagestats_before_footer() {
    global $PAGE, $CFG;

    // Global kill switch.
    $eventenabled  = get_config('local_pagestats', 'eventenabled');
    $jsenabled  = get_config('local_pagestats', 'jsenabled');

    if ($eventenabled) {
        $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';

        $admin = has_capability('moodle/site:config', $PAGE->context);
        if (!$admin) {
            $student = has_capability('moodle/course:isincompletionreports', $PAGE->context);
        } else {
            $student = false;
        }
        if (!$student && !$admin) {
            $teacher = has_capability('moodle/grade:viewall', $PAGE->context);
        } else {
            $teacher = false;
        }

        $event = \local_pagestats\event\page_viewed::create([
            'context' => $PAGE->context,
            'other' => [
                'url' => $PAGE->url->out(false),
                'referer' => (new moodle_url($referer))->out(false),
                'pageregion' => optional_param('frompageregion', '', PARAM_ALPHA),
                'student' => $student,
                'teacher' => $teacher,
                'admin' => $admin,
            ]
        ]);

        $event->trigger();
    }

    if ($jsenabled) {
        $PAGE->requires->js_call_amd('local_pagestats/linkid', 'init', array());
    }
}

