<template>
  <div>
    <div class="home">
      <div class="row">
        <div class="col-lg-5">
          <IntroTextElement></IntroTextElement>
          <InteractiveLogo
            style="max-width:200px; margin:auto; padding:1rem;"
          ></InteractiveLogo>
        </div>
        <div class="col-lg-7 descriptionArea">
          <div>
            <h3>PRACTICAL CONSULTING</h3>
            <div>
              I'm a senior backend engineer who loves turning ideas into
              reliable, high‑performance web services. <br />
              I enjoy solving tough problems, learning new technologies, and
              building tools that make people's lives easier.
            </div>
          </div>
          <br />
          <div class="row">
            <div class="col-sm-12 col-lg-6 col-xl-4">
              <h4>What I Do</h4>
              <div>Here are some areas where I could be of use:</div>
              <br />
              <ul>
                <li>NodeJS Backend Development</li>
                <li>Test Automation Development</li>
                <li>Data Scraping</li>
                <li>Bitcoin Development</li>
                <li>Tool Creation</li>
                <li>Consulting</li>
              </ul>
            </div>
            <div class="col-sm-12 col-lg-6 col-xl-4">
              <h4>What I Like</h4>
              <div>
                About the person behind the company:
              </div>
              <br />
              <ul>
                <li>Martial Arts</li>
                <li>Reading & Writing Stories</li>
                <li>Gaming</li>
                <ul>
                  <li>Diablo 2</li>
                  <li>Team Fortress 2</li>
                  <li>Mount and Blade: Warband</li>
                  <li>etc</li>
                </ul>
              </ul>
            </div>
          </div>
          <div class="col-sm-12 col-md-11 col-lg-10">
            <h4>The Trap of Trends</h4>
            <div>
              New technologies and buzzwords can be exciting, but “new” isn't
              always “better.” It's easy to get swept up in hype and overlook
              proven, stable solutions. I aim to balance innovation with
              practicality, choosing the right tool for the job rather than
              chasing the latest trend for its own sake.
              <br />
              As a consultant, my task is not only to guide you towards best
              practices in the industry, but also to help you stay clear of the
              bad ones.
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IntroTextElement from "./elements/IntroTextElement";
import InteractiveLogo from "./elements/InteractiveLogo";
export default {
  name: "HomePage",
  data() {
    return {};
  },
  props: {},
  components: { IntroTextElement, InteractiveLogo },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.descriptionArea {
  padding: 1em 2em;
}
</style>
