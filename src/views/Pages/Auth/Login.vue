<template>
  <div>
    <!-- ================================================== -->
    <!-- == LOGIN HEADER ================================== -->
    <!-- ================================================== -->
    <div class="header bg-purple py-7 py-lg-8 pt-lg-9">
      <div class="container">
        <div class="header-body text-center mb-5">
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 col-md-8 px-5">
              <h1 class="text-white">
                Bienvenue !
              </h1>
              <p class="text-lead text-white">
                Connectez vous pour accéder au panneau d'administration.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          />
        </svg>
      </div>
    </div>

    <!-- ================================================== -->
    <!-- == LOGIN FORM ==================================== -->
    <!-- ================================================== -->
    <div class="container mt--8 pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-header bg-transparent">
              <div class="text-center mt-2 mb-2">
                Connectez vous à votre compte
              </div>
            </div>
            <div class="card-body px-lg-5 py-lg-5">
              <Form v-slot="{ handleSubmit }">
                <form
                  role="form"
                  @submit="handleSubmit($event, loginSubmit)"
                >
                  <Field
                    v-slot="{ errors, valid }"
                    name="email"
                  >
                    <base-input
                      v-model="loginForm.email"
                      :error="errors[0]"
                      :valid="valid && !errors.include('email')"
                      name="email"
                      class="mb-3"
                      prepend-icon="ni ni-email-83"
                      type="email"
                      placeholder="Adresse mail"
                      autocapitalize="none"
                    />
                  </Field>
                  <Field
                    v-slot="{ errors, valid }"
                    name="email"
                  >
                    <base-input
                      v-model="loginForm.password"
                      :error="errors[0]"
                      :valid="valid && !errors.include('mot de passe')"
                      name="mot de passe"
                      class="mb-3"
                      prepend-icon="ni ni-lock-circle-open"
                      type="password"
                      placeholder="Mot de passe"
                    />
                  </Field>

                  <base-checkbox v-model="loginForm.rememberMe">
                    Se souvenir de moi
                  </base-checkbox>

                  <api-errors
                    :single-error="loginError"
                    :alert-classes="'mt-4 py-3 mb-1'"
                  />

                  <div
                    v-if="userId"
                    class="mt-3 text-center"
                  >
                    <p
                      class="m-0 nav-link font-weight-light"
                      @click="resendEmail()"
                    >
                      Vous n'avez pas reçu l'email ?<br>
                      Cliquez ici pour le ré-envoyer.
                    </p>
                  </div>

                  <div class="text-center">
                    <base-button
                      :disabled="loggingIn"
                      type="primary"
                      native-type="submit"
                      size="lg"
                      class="my-4"
                    >
                      Se connecter
                    </base-button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <!-- TODO: delete /password-reset et peut-être /register -->
        </div>
      </div>
    </div>

    <!-- ================================================== -->
    <!-- == ACCOUNT MIGRATION MODAL ======================= -->
    <!-- ================================================== -->
    <!--    <ValidationObserver v-slot="{ handleSubmit }">-->
    <!--      <form-->
    <!--        v-if="openMigrationModal"-->
    <!--        class="needs-validation"-->
    <!--        @submit.prevent="handleSubmit(migrationSubmit)"-->
    <!--      >-->
    <!--        <modal-->
    <!--          :show="openMigrationModal"-->
    <!--          @close="closeMigrationModal()"-->
    <!--        >-->
    <!--          <template slot="header">-->
    <!--            <h5 class="modal-title">-->
    <!--              Mise à jour du profil-->
    <!--            </h5>-->
    <!--          </template>-->

    <!--          <base-alert-->
    <!--            type="secondary"-->
    <!--            class=" mb-5 text-center"-->
    <!--          >-->
    <!--            <strong>Attention!</strong> Ces informations ne pourront plus êtres modifiées ! En cas de problèmes, contactez un admin.-->
    <!--          </base-alert>-->

    <!--          <div class="row">-->
    <!--            <div class="col-md-6">-->
    <!--              <ValidationProvider-->
    <!--                v-slot="{ errors, valid }"-->
    <!--                name="ville"-->
    <!--                rules="'required|valid_city'"-->
    <!--              >-->
    <!--                <base-input-->
    <!--                  :error="errors[0]"-->
    <!--                  :valid="valid && !errors.include('ville')"-->
    <!--                  class="mb-3"-->
    <!--                  prepend-icon="ni ni-hat-3"-->
    <!--                  label="Séléctionnez votre ville"-->
    <!--                >-->
    <!--                  <select-->
    <!--                    v-model="migrationForm.city"-->
    <!--                    class="form-control"-->
    <!--                  >-->
    <!--                    <option-->
    <!--                      value=""-->
    <!--                      hidden-->
    <!--                    >-->
    <!--                      Votre ville-->
    <!--                    </option>-->
    <!--                    <option>Arras</option>-->
    <!--                    <option>Auxerre</option>-->
    <!--                    <option>Bordeaux</option>-->
    <!--                    <option>Brest</option>-->
    <!--                    <option>Grenoble</option>-->
    <!--                    <option>Lille</option>-->
    <!--                    <option>Lyon</option>-->
    <!--                    <option>Montpellier</option>-->
    <!--                    <option>Nantes</option>-->
    <!--                    <option>Rennes</option>-->
    <!--                    <option>Toulouse</option>-->
    <!--                    <option>Paris</option>-->
    <!--                    <option>Dakar</option>-->
    <!--                  </select>-->
    <!--                </base-input>-->
    <!--              </ValidationProvider>-->
    <!--            </div>-->
    <!--            <div class="col-md-6">-->
    <!--              <GradeSelect-->
    <!--                v-model="migrationForm.grade"-->
    <!--                :school="migrationUserEmail ? guessSchoolFromEmail(migrationUserEmail) : ''"-->
    <!--                :disabled="false"-->
    <!--                :legacy="true"-->
    <!--                label="Séléctionnez votre classe"-->
    <!--              />-->
    <!--            </div>-->
    <!--          </div>-->

    <!--          <div class="row">-->
    <!--            <div class="col-md-6">-->
    <!--              <GroupsSelect-->
    <!--                v-model="migrationForm.group"-->
    <!--                :grade="migrationForm.grade"-->
    <!--                :disabled="false"-->
    <!--                :legacy="true"-->
    <!--                label="Séléctionnez votre groupe"-->
    <!--              />-->
    <!--            </div>-->
    <!--            <div-->
    <!--              v-if="migrationForm.grade === 'SN1' || migrationForm.grade === 'SN2'"-->
    <!--              class="col-md-6"-->
    <!--            >-->
    <!--              <ValidationProvider-->
    <!--                v-slot="{ errors, valid }"-->
    <!--                name="bts"-->
    <!--                rules="'required|boolean'"-->
    <!--              >-->
    <!--                <base-input-->
    <!--                  :error="errors[0]"-->
    <!--                  :valid="valid && !errors.include('bts')"-->
    <!--                  class="mb-3"-->
    <!--                  label="Option BTS"-->
    <!--                  prepend-icon="ni ni-book-bookmark"-->
    <!--                >-->
    <!--                  <select-->
    <!--                    v-model="migrationForm.bts"-->
    <!--                    class="form-control"-->
    <!--                  >-->
    <!--                    <option :value="true">-->
    <!--                      Oui-->
    <!--                    </option>-->
    <!--                    <option :value="false">-->
    <!--                      Non-->
    <!--                    </option>-->
    <!--                  </select>-->
    <!--                </base-input>-->
    <!--              </ValidationProvider>-->
    <!--            </div>-->
    <!--          </div>-->

    <!--          <template slot="footer">-->
    <!--            <base-button-->
    <!--              size="md"-->
    <!--              type="primary"-->
    <!--              native-type="submit"-->
    <!--            >-->
    <!--              Enregistrer-->
    <!--            </base-button>-->
    <!--          </template>-->
    <!--        </modal>-->
    <!--      </form>-->
    <!--    </ValidationObserver>-->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ApiService from '../../../services/api.service'

import GradeSelect from '@/components/Inputs/custom/GradeSelect'
import GroupsSelect from '@/components/Inputs/custom/GroupsSelect'
import Modal from '@/components/Modal.vue'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseInput from '@/components/Inputs/BaseInput.vue'
import BaseCheckbox from '@/components/Inputs/BaseCheckbox.vue'
import ApiErrors from '@/components/ApiErrors.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Field, Form } from 'vee-validate'

export default {
  components: {
    BaseButton,
    ApiErrors,
    BaseCheckbox,
    BaseInput,
    BaseAlert,
    Modal,
    GradeSelect,
    GroupsSelect,
    Field,
    Form
  },
  data () {
    return {
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      migrationForm: {
        city: '',
        grade: '',
        group: '',
        bts: false
      }
    }
  },
  computed: {
    ...mapState({
      loginError: state => state.account.status.loginError,
      loggingIn: state => state.account.status.isLoggingIn,
      userId: state => state.account.status.userId
      // openMigrationModal: state => state.layout.migrationModal.isOpen,
      // migrationToken: state => state.layout.migrationModal.token,
      // migrationUserEmail: state => state.layout.migrationModal.userEmail,
      // migrationUserCity: state => state.layout.migrationModal.userCity,
      // migrationUserGrade: state => state.layout.migrationModal.userGrade
    })
  },
  watch: {
    migrationUserCity: function (newVal) {
      this.migrationForm.city = newVal
    },
    migrationUserGrade: function (newVal) {
      this.migrationForm.grade = newVal
    }
  },
  methods: {
    loginSubmit () {
      // login form + redirect (if provided)
      const data = { ...this.loginForm }
      if (this.$route.query.redirect) data.redirect = this.$route.query.redirect
      this.$store.dispatch('account/login', { email: 'elbert.hermiston@epsi.fr', password: 'password', rememberMe: false })
    },
    migrationSubmit () {
      this.$store.dispatch('account/migrate', { token: this.migrationToken, ...this.migrationForm })
    },
    closeMigrationModal () {
      this.$store.commit('layout/CLOSE_MIGRATION_MODAL')
    },
    resendEmail () {
      if (!this.userId) return
      ApiService.post(`/auth/verify/email/resend/${this.userId}`)
        .then(res => {
          if (res.status === 200) {
            this.$notify({ type: 'success', message: 'Un email de confirmation d\'inscription vient d\'être ré-envoyé !' })
          }
        })
        .catch(err => {
          this.$notify({ type: 'danger', message: `<b>Erreur !</b> ${err.data.message || err} !` })
        })
    },
    guessSchoolFromEmail (email) {
      if (email.includes('@epsi.fr')) return 'EPSI'
      if (email.includes('@wis.fr') || email.includes('@ecoles-wis.net')) return 'WIS'
    },
    isValid (name) {
      return this.validated && !this.errors.has(name)
    }
  }
}
</script>
