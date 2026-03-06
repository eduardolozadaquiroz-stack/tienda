<template>
    <div class="sb-wrap">
        <div class="sb-profile">
            <div class="sb-avatar">
                <img v-if="userData.avatar"
                    :src="userData.avatar.startsWith('http') ? userData.avatar : ($url + '/obtener_avatar_cliente/' + userData.avatar)"
                    alt="Avatar"
                />
                <span v-else class="sb-initials">{{ initials }}</span>
            </div>
            <h5 class="sb-name">{{ userData.nombres }} {{ userData.apellidos }}</h5>
            <p class="sb-country">{{ userData.pais || '' }}</p>
        </div>
        <nav class="sb-nav">
            <router-link active-class="sb-active" to="/cuenta/perfil" class="sb-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                Mi perfil
            </router-link>
            <router-link active-class="sb-active" to="/cuenta/venta" class="sb-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Ventas
            </router-link>
            <router-link active-class="sb-active" to="/cuenta/direcciones" class="sb-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Direcciones
            </router-link>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'SidebarCliente',
    computed: {
        userData() {
            try { return JSON.parse(this.$store.state.user || '{}') } catch { return {} }
        },
        initials() {
            const n = (this.userData.nombres || '').trim().split(' ')[0] || ''
            const a = (this.userData.apellidos || '').trim().split(' ')[0] || ''
            return ((n[0] || '') + (a[0] || '')).toUpperCase() || '?'
        }
    }
}
</script>

<style scoped>
.sb-wrap {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    overflow: hidden;
}

/* ── perfil ── */
.sb-profile {
    padding: 28px 20px 20px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
}
.sb-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #111;
    margin: 0 auto 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.sb-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 50%;
}
.sb-initials {
    color: #fff;
    font-size: 26px;
    font-weight: 700;
    line-height: 1;
    user-select: none;
}
.sb-name {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 700;
    color: #111;
}
.sb-country {
    margin: 0;
    font-size: 13px;
    color: #999;
}

/* ── nav ── */
.sb-nav {
    display: flex;
    flex-direction: column;
}
.sb-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    font-size: 14px;
    font-weight: 500;
    color: #444;
    text-decoration: none;
    border-bottom: 1px solid #f5f5f5;
    transition: background .15s, color .15s;
}
.sb-link:last-child { border-bottom: none; }
.sb-link svg { width: 17px; height: 17px; flex-shrink: 0; }
.sb-link:hover { background: #f7f7f7; color: #111; }
.sb-active { background: #f2f2f2; color: #111; font-weight: 700; }

/* ── responsivo: en móvil el nav se hace horizontal ── */
@media (max-width: 900px) {
    .sb-wrap { border-radius: 12px; }
    .sb-profile { padding: 20px 16px 16px; }
    .sb-avatar { width: 64px; height: 64px; }
    .sb-initials { font-size: 20px; }
    .sb-nav { flex-direction: row; }
    .sb-link { flex: 1; justify-content: center; flex-direction: column; gap: 4px; font-size: 12px; padding: 12px 8px; text-align: center; border-bottom: none; border-right: 1px solid #f5f5f5; }
    .sb-link:last-child { border-right: none; }
    .sb-link svg { width: 20px; height: 20px; }
}
</style>
