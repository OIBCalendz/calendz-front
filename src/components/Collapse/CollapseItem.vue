<template>
  <div class="card">
    <div
      :aria-expanded="active"
      role="tab"
      class="card-header"
    >
      <a
        :href="`#${itemId}`"
        :aria-controls="`content-${itemId}`"
        data-toggle="collapse"
        data-parent="#accordion"
        @click.prevent="activate"
      >
        <slot name="title"> {{ title }} </slot>
        <i class="tim-icons icon-minimal-down" />
      </a>
    </div>
    <Transition>
      <div
        v-show="active"
        :id="`content-${itemId}`"
        :aria-labelledby="title"
        role="tabpanel"
        class="collapsed"
      >
        <div class="card-body">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>
<script>

export default {
  name: 'CollapseItem',
  inject: {
    animationDuration: {
      default: 250
    },
    multipleActive: {
      default: false
    },
    addItem: {
      default: () => {}
    },
    removeItem: {
      default: () => {}
    },
    deactivateAll: {
      default: () => {}
    }
  },
  props: {
    title: {
      type: String,
      default: '',
      description: 'Collapse item title'
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    itemId () {
      return this.id || this.title
    }
  },
  mounted () {
    this.addItem(this)
  },
  destroyed () {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    this.removeItem(this)
  },
  methods: {
    activate () {
      const wasActive = this.active
      if (!this.multipleActive) {
        this.deactivateAll()
      }
      this.active = !wasActive
    }
  }
}
</script>
<style>
/*@TODO transition: collapse :duration="animationDuration"*/
</style>
