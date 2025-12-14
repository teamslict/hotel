/**
 * branches.js - Branch Selector for Multi-Location Hotels
 * 
 * Handles fetching branches and displaying a location selector
 * for hotels with multiple locations.
 */

const BranchManager = {
    branches: [],
    selectedBranch: null,

    /**
     * Initialize branch selector
     */
    async init() {
        // Wait for tenant to be ready
        if (typeof tenantReadyPromise !== 'undefined') {
            await tenantReadyPromise;
        }

        // Fetch branches for this tenant
        await this.fetchBranches();

        // If branches exist, show the selector
        if (this.branches.length > 1) {
            this.renderBranchSelector();
        }

        // Dispatch event when ready
        window.dispatchEvent(new CustomEvent('branchesReady', {
            detail: { branches: this.branches, selected: this.selectedBranch }
        }));
    },

    /**
     * Fetch branches from API
     */
    async fetchBranches() {
        try {
            const subdomain = CONFIG.getSubdomain();
            const response = await fetch(
                `${CONFIG.API_BASE_URL}/api/public/hotel/branches?subdomain=${subdomain}`
            );

            if (response.ok) {
                this.branches = await response.json();

                // Get saved branch or use default
                const savedBranchId = localStorage.getItem('hotel_branch');
                const savedBranch = this.branches.find(b => b.id === savedBranchId);
                const defaultBranch = this.branches.find(b => b.isDefault) || this.branches[0];

                this.selectedBranch = savedBranch || defaultBranch;

                console.log(`[Branches] Loaded ${this.branches.length} branches, selected: ${this.selectedBranch?.name}`);
            }
        } catch (error) {
            console.error('[Branches] Failed to fetch branches:', error);
        }
    },

    /**
     * Render branch selector dropdown
     */
    renderBranchSelector() {
        const container = document.getElementById('branch-selector');
        if (!container || this.branches.length <= 1) return;

        const current = this.selectedBranch;

        container.innerHTML = `
            <div class="branch-dropdown">
                <button class="branch-btn" id="branch-toggle">
                    <span class="branch-icon">📍</span>
                    <span class="branch-name">${current?.city || 'Select Location'}</span>
                    <span class="branch-arrow">▼</span>
                </button>
                <div class="branch-menu" id="branch-menu">
                    ${this.branches.map(branch => `
                        <button class="branch-option ${branch.id === current?.id ? 'active' : ''}" 
                                data-branch-id="${branch.id}"
                                data-branch-city="${branch.city}">
                            <span class="branch-city">${branch.city}</span>
                            <span class="branch-country">${branch.country}</span>
                            <span class="branch-rooms">${branch._count?.rooms || 0} rooms</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add styles if not already added
        this.addStyles();

        // Toggle dropdown
        const toggle = document.getElementById('branch-toggle');
        const menu = document.getElementById('branch-menu');

        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            menu?.classList.toggle('show');
        });

        // Handle option clicks
        container.querySelectorAll('.branch-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const branchId = btn.dataset.branchId;
                this.selectBranch(branchId);
                menu?.classList.remove('show');
            });
        });

        // Close on click outside
        document.addEventListener('click', () => {
            menu?.classList.remove('show');
        });
    },

    /**
     * Select a branch
     */
    selectBranch(branchId) {
        const branch = this.branches.find(b => b.id === branchId);
        if (!branch || branch.id === this.selectedBranch?.id) return;

        this.selectedBranch = branch;
        localStorage.setItem('hotel_branch', branchId);

        // Update UI
        const nameEl = document.querySelector('.branch-name');
        if (nameEl) nameEl.textContent = branch.city;

        // Update active state
        document.querySelectorAll('.branch-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.branchId === branchId);
        });

        // Dispatch event for other scripts to react
        window.dispatchEvent(new CustomEvent('branchChanged', {
            detail: { branch }
        }));

        console.log(`[Branches] Selected: ${branch.name}`);
    },

    /**
     * Get selected branch ID (for API calls)
     */
    getSelectedBranchId() {
        return this.selectedBranch?.id || null;
    },

    /**
     * Add CSS styles for branch selector
     */
    addStyles() {
        if (document.getElementById('branch-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'branch-styles';
        styles.textContent = `
            .branch-dropdown {
                position: relative;
                display: inline-block;
            }
            
            .branch-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 6px;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }
            
            .branch-btn:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .branch-icon {
                font-size: 16px;
            }
            
            .branch-arrow {
                font-size: 10px;
                opacity: 0.7;
            }
            
            .branch-menu {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                min-width: 220px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.2s;
                z-index: 1000;
                overflow: hidden;
            }
            
            .branch-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .branch-option {
                display: flex;
                flex-direction: column;
                width: 100%;
                padding: 12px 16px;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .branch-option:hover {
                background: #f3f4f6;
            }
            
            .branch-option.active {
                background: #e0f2fe;
            }
            
            .branch-city {
                font-weight: 600;
                color: #1f2937;
                font-size: 14px;
            }
            
            .branch-country {
                font-size: 12px;
                color: #6b7280;
            }
            
            .branch-rooms {
                font-size: 11px;
                color: #9ca3af;
                margin-top: 2px;
            }
        `;
        document.head.appendChild(styles);
    }
};

// Auto-init when DOM is ready (after tenant is loaded)
document.addEventListener('DOMContentLoaded', () => {
    // Delay init slightly to ensure tenant is ready
    setTimeout(() => BranchManager.init(), 500);
});
