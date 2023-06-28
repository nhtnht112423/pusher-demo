import axios  from 'axios';

export class UserAPI {
  constructor(config) {
    this.axios = axios.create({
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      baseURL: `https://ned.dev.demo.api.riverr.ai/api/v1/myid`,
    });
  }

  async login() {
      try {
          const res = await this.axios.post('/signin', {
              "my_id": {
                  "username": "sonny@riverr.ai",
                  "password": "son123456"
              },
              "device_id": "ab7a653d-1d65-48de-a15f-0f168fb1f26a",
              "device_name": "ios"
          });
          const token = res.data?.access_token || '';
          this.axios = axios.create({
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              baseURL: `https://ned.dev.demo.api.riverr.ai/api/v1/myid`,
          });
          return token;
      } catch (e) {
          console.error( e);
      }
  }

  async me() {
      try {
          const res = await this.axios.post('/me');
          return res.data.user
      } catch (e) {
          console.error(e)
      }
  }
}
