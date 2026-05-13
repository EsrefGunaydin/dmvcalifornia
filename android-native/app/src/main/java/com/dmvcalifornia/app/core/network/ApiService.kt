package com.dmvcalifornia.app.core.network

import com.dmvcalifornia.app.core.model.LeaderboardListResponse
import com.dmvcalifornia.app.core.model.LeaderboardResponse
import com.dmvcalifornia.app.core.model.LeaderboardSubmission
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {

    @POST("leaderboard")
    suspend fun submitScore(@Body submission: LeaderboardSubmission): LeaderboardResponse

    @GET("leaderboard")
    suspend fun getLeaderboard(@Query("quizId") quizId: String? = null): LeaderboardListResponse
}
