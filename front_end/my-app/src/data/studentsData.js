export const studentsData = [
    {
        id: 1, name: "Emma Johnson", username: "emma", password: "password123", age: 8, joinDate: "2024-01-15",
        performance: {
            easy: { correct: 28, total: 40, percentage: 70, lastScore: 280, improvement: "+15%" },
            medium: { correct: 15, total: 30, percentage: 50, lastScore: 300, improvement: "+8%" },
            hard: { correct: 5, total: 20, percentage: 25, lastScore: 150, improvement: "+12%" }
        },
        totalSessions: 24, streakDays: 7
    },
    {
        id: 2, name: "Alex Smith", username: "alex", password: "password123", age: 9, joinDate: "2024-02-20",
        performance: {
            easy: { correct: 35, total: 40, percentage: 87, lastScore: 350, improvement: "+20%" },
            medium: { correct: 22, total: 30, percentage: 73, lastScore: 440, improvement: "+25%" },
            hard: { correct: 8, total: 15, percentage: 53, lastScore: 240, improvement: "+18%" }
        },
        totalSessions: 18, streakDays: 12
    },
    {
        id: 3, name: "Sophia Davis", username: "sophia", password: "password123", age: 7, joinDate: "2024-03-10",
        performance: {
            easy: { correct: 22, total: 30, percentage: 73, lastScore: 220, improvement: "+10%" },
            medium: { correct: 8, total: 20, percentage: 40, lastScore: 160, improvement: "+5%" },
            hard: { correct: 2, total: 10, percentage: 20, lastScore: 60, improvement: "+3%" }
        },
        totalSessions: 12, streakDays: 3
    }
];