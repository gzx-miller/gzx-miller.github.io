import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface LearningCourse {
  id: number
  title: string
  minutes: number
}

export const useLearningStore = defineStore('learning', () => {
  const courses = ref<LearningCourse[]>([
    { id: 1, title: 'Pinia Setup Store', minutes: 35 },
  ])
  const completedIds = ref<number[]>([])

  const totalMinutes = computed(() => courses.value.reduce((sum, course) => sum + course.minutes, 0))
  const completionRate = computed(() => Math.round(completedIds.value.length / courses.value.length * 100))

  function enroll(course: LearningCourse) {
    if (!courses.value.some((item) => item.id === course.id)) courses.value.push(course)
  }

  function toggleCompleted(id: number) {
    completedIds.value = completedIds.value.includes(id)
      ? completedIds.value.filter((courseId) => courseId !== id)
      : [...completedIds.value, id]
  }

  return { courses, completedIds, totalMinutes, completionRate, enroll, toggleCompleted }
})
