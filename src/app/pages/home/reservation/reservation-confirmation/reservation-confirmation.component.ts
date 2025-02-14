import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../../../shared/services/reservation.service';
import { CheckoutService } from '../../../../shared/services/checkout.service';
import { ReservationResponse } from '../../../../shared/models/response/reservation-response.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-confirmation',
  standalone: true,
  imports: [
    MatIconModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './reservation-confirmation.component.html',
  styleUrl: './reservation-confirmation.component.css'
})
export class ReservationConfirmationComponent {

  private route = inject(ActivatedRoute);
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private checkoutService = inject(CheckoutService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  reservation!: ReservationResponse; 
  reservationIdStr!: string;
  
  loading = false;

  ngOnInit(): void {    
    const reservationId = localStorage.getItem('reservationId');   

    if (reservationId) {
      this.loadReservationDetails(+reservationId);  // Convertir a número si es necesario
      localStorage.removeItem('reservationId'); // Eliminar el ID después de cargar los datos
    }
  }

  loadReservationDetails(reservationId: number): void {
    this.reservationService.getReservationById(reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;        
      },
      error: () => this.showSnackBar('Failed to load reservation details!')
    });
  }

  get user() {
    return this.authService.getCurrentUser();
  }

  onContinueShopping(): void {
    this.router.navigate(['/pages/restaurants']);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
 

}
