package com.dmvcalifornia.app.core.util

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HapticManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val vibrator: Vibrator by lazy {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val manager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            manager.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        }
    }

    private fun vibrate(durationMs: Long, amplitude: Int = VibrationEffect.DEFAULT_AMPLITUDE) {
        val effect = VibrationEffect.createOneShot(durationMs, amplitude)
        vibrator.vibrate(effect)
    }

    fun light() = vibrate(20, 50)
    fun medium() = vibrate(30, 128)
    fun heavy() = vibrate(40, 255)
    fun soft() = vibrate(15, 30)

    fun success() = vibrate(30, 180)
    fun warning() = vibrate(40, 100)
    fun error() {
        val timings = longArrayOf(0, 30, 50, 30)
        val amplitudes = intArrayOf(0, 150, 0, 100)
        val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
        vibrator.vibrate(effect)
    }

    fun correctAnswer() = vibrate(20, 100)

    fun wrongAnswer() {
        val timings = longArrayOf(0, 25, 50, 25)
        val amplitudes = intArrayOf(0, 120, 0, 80)
        val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
        vibrator.vibrate(effect)
    }

    fun xpGain() = vibrate(15, 50)

    fun levelUp() {
        val timings = longArrayOf(0, 30, 80, 40, 80, 50)
        val amplitudes = intArrayOf(0, 120, 0, 180, 0, 255)
        val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
        vibrator.vibrate(effect)
    }

    fun achievement() {
        val timings = longArrayOf(0, 30, 80, 40, 80, 50)
        val amplitudes = intArrayOf(0, 150, 0, 200, 0, 255)
        val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
        vibrator.vibrate(effect)
    }

    fun buttonTap() = vibrate(10, 50)
    fun cardFlip() = vibrate(20, 80)

    fun quizComplete() {
        val timings = longArrayOf(0, 40, 150, 40)
        val amplitudes = intArrayOf(0, 180, 0, 255)
        val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
        vibrator.vibrate(effect)
    }

    fun perfectScore() {
        val timings = longArrayOf(0, 40, 120, 40, 120, 40)
        val amplitudes = intArrayOf(0, 255, 0, 255, 0, 255)
        val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
        vibrator.vibrate(effect)
    }
}
