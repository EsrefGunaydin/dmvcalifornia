package com.dmvcalifornia.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.dmvcalifornia.app.ui.navigation.AppNavigation
import com.dmvcalifornia.app.ui.theme.DMVCaliforniaTheme
import com.google.android.gms.ads.MobileAds
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize AdMob
        MobileAds.initialize(this) {}

        setContent {
            DMVCaliforniaTheme {
                AppNavigation()
            }
        }
    }
}
