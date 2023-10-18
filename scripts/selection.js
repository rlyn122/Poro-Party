import { ref } from 'vue'
import ChildComp from  './ChildComp.vue'

const selected = ref(true)

function mainScreen() {
    window.location.href = "mainMap.html";
}

function toggle() {
    selected.value = !selected.value
}