<?php

namespace App\Mail;

use App\Models\Solicitacaocontato;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SolicitacaoContatoMail2 extends Mailable
{
    use Queueable, SerializesModels;
    public $contato;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Solicitacaocontato $solicitacaocontato)
    {

        $this->contato = $solicitacaocontato;

    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        return $this
            ->subject('Nova solicitação de contato!')

            ->view('emails.solicitacao-contato2')
            ->with(['contato' =>$this->contato]);
    }
}
