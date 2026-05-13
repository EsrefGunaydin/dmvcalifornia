package com.dmvcalifornia.app.core.util

import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

object DateUtils {
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)

    fun formatDate(date: Date = Date()): String = dateFormat.format(date)

    fun formatDate(millis: Long): String = dateFormat.format(Date(millis))

    fun yesterday(): String {
        val cal = Calendar.getInstance()
        cal.add(Calendar.DAY_OF_YEAR, -1)
        return dateFormat.format(cal.time)
    }

    fun today(): String = formatDate()

    fun isToday(dateString: String): Boolean = dateString == today()

    fun isYesterday(dateString: String): Boolean = dateString == yesterday()

    fun formatRelativeDate(millis: Long): String {
        val now = System.currentTimeMillis()
        val diff = now - millis
        val seconds = diff / 1000
        val minutes = seconds / 60
        val hours = minutes / 60
        val days = hours / 24

        return when {
            seconds < 60 -> "Just now"
            minutes < 60 -> "${minutes}m ago"
            hours < 24 -> "${hours}h ago"
            days < 7 -> "${days}d ago"
            else -> {
                val displayFormat = SimpleDateFormat("MMM d", Locale.US)
                displayFormat.format(Date(millis))
            }
        }
    }
}
