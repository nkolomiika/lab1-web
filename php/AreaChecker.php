<?php

class AreaChecker
{
    public static function isInArea($x, $y, $r){
        // Triangle in top-right quadrant
        if ($x >= 0 && $y >= 0) {
            return ($x <= $r) && ($y <= $r / 2);
        }
        // Rectangle in top-left quadrant
        if ($x < 0 && $y >= 0) {
            return ($x >= -$r / 2) && ($y <= $r);
        }
        // Circle in bottom-left quadrant
        if ($x <= 0 && $y < 0) {
            return ($x * $x + $y * $y) <= ($r * $r);
        }
        // For bottom-right quadrant, always return false
        return false;
    }
}