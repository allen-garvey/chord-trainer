<template>
    <div>
        <button @click="generateChords">Generate chords</button>
        <button @click="play">Play</button>

        <ol>
            <li v-for="(chord, i) in chords" :key="i">{{ chord.name }}</li>
        </ol>
    </div>
</template>

<style lang="scss" module>

</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { Chord, getRandomChords } from '../chords';
import { playChords } from '../player';

export default defineComponent({
    components: {
    },
    created(){
        this.generateChords();
    },
    data(){
        return {
            chords: [] as Chord[],
        };
    },
    computed: {
    },
    methods: {
        generateChords(){
            this.chords = getRandomChords(4);
        },
        play(){
            playChords(this.chords);
        },
    }
});
</script>